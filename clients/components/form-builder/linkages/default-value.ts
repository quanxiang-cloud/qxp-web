import { ajax } from 'rxjs/ajax';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, debounceTime, filter, map, catchError } from 'rxjs/operators';
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import logger from '@lib/logger';
import { compareOperatorMap } from '@c/form-builder/constants';

const { onFieldValueChange$ } = FormEffectHooks;

type FetchLinkedTableDataParams = {
  conditions: {
    condition: Array<{ key: string; op: string; value: Array<any>; }>;
    tag: 'and' | 'or';
  };
  sort: string[];
}

function getFieldPath(linkageRulePath: string, fieldRealPath: string): string {
  const [match] = /\.\d+\./.exec(fieldRealPath) || [];
  return linkageRulePath.replace('.*.', match);
}

function fetchLinkedTableData$(
  getFieldValue: (path: string) => any,
  linkage: FormBuilder.DefaultValueLinkage,
): Observable<Record<string, any>> {
  const conditions = linkage.rules.map((rule) => {
    if (rule.compareTo === 'fixedValue') {
      return {
        key: rule.fieldName,
        op: compareOperatorMap[rule.compareOperator].op,
        value: Array.isArray(rule.compareValue) ? rule.compareValue : [rule.compareValue],
      };
    }
    const currentValue = getFieldValue(rule.compareValue);
    return {
      key: rule.fieldName,
      op: compareOperatorMap[rule.compareOperator].op,
      value: Array.isArray(currentValue) ? currentValue : [currentValue],
    };
  });

  const params: FetchLinkedTableDataParams = {
    sort: (linkage.linkedTableSortRules || []).filter(Boolean),
    conditions: {
      tag: linkage.ruleJoinOperator === 'every' ? 'and' : 'or',
      condition: conditions,
    },
  };

  return ajax({
    url: `/api/v1/form/${linkage.linkedAppID}/home/form/${linkage.linkedTable.id}`,
    method: 'POST',
    headers: { 'X-Proxy': 'API', 'Content-Type': 'application/json' },
    body: {
      ...params,
      method: 'find',
      page: 1,
      size: 1,
    },
  }).pipe(
    catchError(() => of({ response: undefined })),
    map(({ response }) => response?.data?.entities?.[0]),
    filter((record) => !!record),
  );
}

function shouldFetchLinkedTableData(
  getFieldValue: (path: string) => any,
  linkage: FormBuilder.DefaultValueLinkage,
  fieldRealPath: string,
): boolean {
  const compareToValues = linkage.rules.map((rule) => {
    if (rule.compareTo === 'fixedValue') {
      if (!rule.compareValue) {
        logger.debug('WARNING: find empty fixedValue in defaultValueLinkages rules');
      }
      return rule.compareValue;
    }
    rule.compareValue = getFieldPath(rule.compareValue, fieldRealPath);
    return getFieldValue(rule.compareValue);
  });

  if (linkage.ruleJoinOperator === 'every') {
    return compareToValues.every((value) => !!value);
  }

  return compareToValues.some((value) => !!value);
}

type ShouldFireEffectParams = {
  linkedRow?: Record<string, any>;
  linkage: FormBuilder.DefaultValueLinkage;
  getFieldValue: (path: string) => any;
}

function shouldFireEffect({ linkage, linkedRow, getFieldValue }: ShouldFireEffectParams): boolean {
  if (!linkedRow) {
    return false;
  }

  const pairs = linkage.rules.map((rule) => {
    return {
      operator: rule.compareOperator,
      leftValue: linkedRow[rule.fieldName],
      rightValue: rule.compareTo === 'fixedValue' ? rule.compareValue : getFieldValue(rule.compareValue),
    };
  });

  return pairs[linkage.ruleJoinOperator].call(pairs, ({ operator, leftValue, rightValue }) => {
    const comparator = compareOperatorMap[operator].comparator;
    try {
      return comparator(leftValue, rightValue);
    } catch (error) {
      logger.error(
        'Error occurred while run comparator:', comparator,
        'with params:', leftValue, rightValue,
        'Error:', error,
      );
      return false;
    }
  });
}

function transformSubTableLinkage(
  linkage: FormBuilder.DefaultValueLinkage,
  subTableFieldName: string,
): FormBuilder.DefaultValueLinkage {
  linkage.rules = linkage.rules.map((rule) => {
    if (rule.compareTo === 'currentFormValue' && !rule.compareValue.includes('.')) {
      rule.compareValue = `${subTableFieldName}.*.${rule.compareValue}`;
    }
    return rule;
  });

  linkage.targetField = `${subTableFieldName}.*.${linkage.targetField}`;

  return linkage;
}

function findAllLinkages(schema: ISchema, subTableFieldName?: string): FormBuilder.DefaultValueLinkage[] {
  return Object.entries(schema.properties || {}).reduce<FormBuilder.DefaultValueLinkage[]>((
    linkages,
    [fieldName, fieldSchema]: [string, ISchema],
  ) => {
    if (fieldSchema.items && fieldSchema['x-component']?.toLowerCase() === 'subtable') {
      linkages.push(...findAllLinkages(fieldSchema.items as ISchema, fieldName));
    }

    const defaultValueFrom = fieldSchema['x-internal']?.defaultValueFrom;
    const linkage = fieldSchema['x-internal']?.defaultValueLinkage;
    if (defaultValueFrom === 'linkage' && linkage) {
      linkage.targetField = fieldName;
      const _linkage = subTableFieldName ? transformSubTableLinkage(linkage, subTableFieldName) : linkage;
      linkages.push(_linkage);
    }

    return linkages;
  }, []);
}

type ExecuteLinkage = {
  linkage: FormBuilder.DefaultValueLinkage;
  formActions: ISchemaFormActions,
}

function executeLinkage({ linkage, formActions }: ExecuteLinkage): void {
  const { setFieldState, getFieldValue } = formActions;
  const listenedOnFields: string[] = [];
  linkage.rules.forEach((rule) => {
    if (rule.compareTo === 'currentFormValue') {
      listenedOnFields.push(rule.compareValue);
    }
  });

  if (!listenedOnFields.length) {
    of(true).pipe(
      switchMap(() => fetchLinkedTableData$(getFieldValue, linkage)),
      filter((linkedRow) => shouldFireEffect({ linkedRow, linkage, getFieldValue })),
    ).subscribe((linkedRow) => {
      logger.debug(`execute defaultValueLinkage on field: ${linkage.targetField}`);
      setFieldState(linkage.targetField, (state) => {
        state.value = linkage.linkedField ? linkedRow[linkage.linkedField] : linkedRow;
      });
    });
    return;
  }

  onFieldValueChange$(`*(${listenedOnFields.join(',')})`).pipe(
    debounceTime(200),
    filter((state) => shouldFetchLinkedTableData(getFieldValue, linkage, state.path)),
    switchMap((state) => combineLatest([fetchLinkedTableData$(getFieldValue, linkage), of(state.path)])),
    filter(([linkedRow]) => shouldFireEffect({ linkedRow, linkage, getFieldValue })),
  ).subscribe(([linkedRow, fieldRealPath]) => {
    logger.debug(`execute defaultValueLinkage on field: ${linkage.targetField}`);
    setFieldState(getFieldPath(linkage.targetField, fieldRealPath), (state) => {
      state.value = linkage.linkedField ? linkedRow[linkage.linkedField] : linkedRow;
    });
  });
}

export default function DefaultValueLinkageEffect(schema: ISchema, formActions: ISchemaFormActions): void {
  findAllLinkages(schema).forEach((linkage) => {
    executeLinkage({ linkage, formActions });
  });
}
