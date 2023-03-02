import { Observable, of, combineLatest } from 'rxjs6';
import { switchMap, debounceTime, filter, map, catchError } from 'rxjs6/operators';
import { from } from 'rxjs6';
import { mergeDeepRight } from 'ramda';
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import logger from '@lib/logger';
import { fetchFormDataList, FormDataListResponse } from '@lib/http-client-form';
import { operatorESParameter, Rule, setESQueryParams, QueryParamsType } from '@c/data-filter/utils';
import { compareOperatorMap } from '@c/form-builder/constants';

const { onFieldValueChange$ } = FormEffectHooks;

export function getFieldPath(linkageRulePath: string, fieldRealPath: string): string {
  const [match] = /\.\d+\./.exec(fieldRealPath) || [];
  return match ? linkageRulePath.replace('.*.', match) : linkageRulePath;
}

function fetchLinkedTableData$(
  getFieldValue: (path: string) => any,
  linkage: FormBuilder.DefaultValueLinkage,
): Observable<Record<string, any>[]> {
  const rules: Rule[] = linkage.rules.map((rule) => {
    return operatorESParameter(
      rule.fieldName,
      compareOperatorMap[rule.compareOperator].op,
      rule.compareTo === 'fixedValue' ? rule.compareValue as FormValue : getFieldValue(rule.compareValue),
    );
  });
  const filterRules: Rule[] = linkage.filterConfig?.condition.map((rule) => {
    return operatorESParameter(
      rule.key!,
      rule.op!,
      rule.valueFrom === 'fixedValue' ? rule.value as FormValue : getFieldValue(rule.value as string),
    );
  }) ?? [];

  const linkageRule = {
    [linkage.ruleJoinOperator === 'every' ? 'must' : 'should']: rules.length > 0 ? rules : [],
  };
  const filterRule = {
    [linkage.filterConfig?.tag as string]: filterRules.length > 0 ? filterRules : [],
  };

  return from(
    fetchFormDataList(linkage.linkedAppID, linkage.linkedTable.id, {
      sort: (linkage.linkedTableSortRules || []).filter(Boolean),
      size: 999,
      query: setESQueryParams(mergeDeepRight(linkageRule, filterRule) as QueryParamsType),
    }),
  ).pipe(
    catchError(() => of({ entities: [], total: 0 })),
    filter((res) => !!res),
    map((res: FormDataListResponse) => res.entities),
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
  return Object.entries(schema.properties || {})?.reduce<FormBuilder.DefaultValueLinkage[]>((
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
      linkage.filterConfig = fieldSchema['x-component-props']?.filterConfig;
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

function getMultipleStatus(schema: ISchema, linkage: FormBuilder.DefaultValueLinkage): boolean {
  const fieldId = linkage.targetField;
  return !!schema.properties?.[fieldId]?.['x-component-props']?.multiple;
}

function getLinkedRows(
  linkage: FormBuilder.DefaultValueLinkage,
  getFieldValue: (path: string) => any,
  linkedRow: any[],
  fieldRealPath?: string,
): any[] {
  const linkedRows = !Array.isArray(linkedRow) ? [linkedRow] : linkedRow;
  const rows = linkedRows.map((linkedRow) => {
    const shouldFire = shouldFireEffect({ linkedRow, linkage, getFieldValue });
    if (shouldFire) {
      return linkedRow;
    }
    return null;
  }).filter(Boolean);
  return [rows, fieldRealPath];
}

function executeLinkage(schema: ISchema, { linkage, formActions }: ExecuteLinkage): void {
  const isMultiple = getMultipleStatus(schema, linkage);
  const { setFieldState, getFieldValue } = formActions;
  const listenedOnFields: string[] = [];
  const linkedField = linkage.linkedField;
  linkage.rules.forEach((rule) => {
    if (rule.compareTo === 'currentFormValue') {
      listenedOnFields.push(rule.compareValue);
    }
  });

  if (!listenedOnFields.length) {
    of(true).pipe(
      switchMap(() => fetchLinkedTableData$(getFieldValue, linkage)),
      map((linkedRow) => getLinkedRows(linkage, getFieldValue, linkedRow)),
    ).subscribe(([linkedRow]) => {
      logger.debug(`execute defaultValueLinkage on field: ${linkage.targetField}`);
      setFieldState(linkage.targetField, (state) => {
        state.value = linkedField ? linkedRow[0][linkedField] : getlinkedValData(linkedRow, isMultiple);
      });
    });
    return;
  }

  onFieldValueChange$(`*(${listenedOnFields.join(',')})`).pipe(
    debounceTime(200),
    filter((state) => shouldFetchLinkedTableData(getFieldValue, linkage, state.path)),
    switchMap((state) => combineLatest([fetchLinkedTableData$(getFieldValue, linkage), of(state.path)])),
    map(([linkedRow, fieldRealPath]) => getLinkedRows(linkage, getFieldValue, linkedRow, fieldRealPath)),
  ).subscribe(([linkedRow, fieldRealPath]) => {
    logger.debug(`execute defaultValueLinkage on field: ${linkage.targetField}`);
    setFieldState(getFieldPath(linkage.targetField, fieldRealPath), (state) => {
      state.value = linkedField ? linkedRow[0][linkedField] : getlinkedValData(linkedRow, isMultiple);
    });
  });
}
function getlinkedValData(linkedRow: any[], isMultiple: boolean): any[] {
  if (isMultiple) {
    return linkedRow;
  } else {
    return linkedRow.length > 0 ? [linkedRow[0]] : [];
  }
}
export default function DefaultValueLinkageEffect(schema: ISchema, formActions: ISchemaFormActions): void {
  findAllLinkages(schema).forEach((linkage) => {
    executeLinkage(schema, { linkage, formActions });
  });
}
