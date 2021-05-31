import { ajax, AjaxResponse } from 'rxjs/ajax';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, filter, map } from 'rxjs/operators';
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import logger from '@lib/logger';

import compareOperatorMap from './compare-operator-map';

const { onFieldValueChange$ } = FormEffectHooks;

type FetchLinkedTableDataParams = {
  condition?: Array<{ key: string; op: string; value: Array<any>; }>;
  tag: 'and' | 'or';
  sort: string[];
}

function fetchLinkedTableData$(
  getFieldValue: (path: string) => any,
  linkage: FormBuilder.DefaultValueLinkage,
): Observable<AjaxResponse> {
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
    tag: linkage.ruleJoinOperator === 'every' ? 'and' : 'or',
    condition: conditions,
  };

  // const side = window.SIDE === 'portal' ? 'm' : 'home';
  const side = 'home';
  return ajax({
    url: `/api/v1/structor/${linkage.linkedAppID}/${side}/form/${linkage.linkedTable.id}`,
    method: 'POST',
    headers: {
      'X-Proxy': 'API',
      'Content-Type': 'application/json',
    },
    body: {
      ...params,
      method: 'find',
      page: 1,
      size: 1,
    },
  });
}

function shouldFetchLinkedTableData(
  getFieldValue: (path: string) => any,
  linkage: FormBuilder.DefaultValueLinkage,
): boolean {
  const compareToValues = linkage.rules.map((rule) => {
    if (rule.compareTo === 'fixedValue') {
      if (!rule.compareValue) {
        logger.debug('WARNING: find empty fixedValue in defaultValueLinkages rules');
      }
      return rule.compareValue;
    }

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
        'Error:', error
      );
      return false;
    }
  });
}

// todo support nested properties
function findAllLinkages(schema: ISchema): FormBuilder.DefaultValueLinkage[] {
  return Object.keys(schema.properties || {}).map<FormBuilder.DefaultValueLinkage>((fieldName) => {
    const defaultValueFrom = get(schema, `properties.${fieldName}.x-internal.defaultValueFrom`);
    const linkage = get(schema, `properties.${fieldName}.x-internal.defaultValueLinkage`);

    if (!linkage || defaultValueFrom !== 'linkage') {
      return false;
    }
    return { ...linkage, targetField: fieldName };
  }).filter((linkage) => !!linkage);
}

type ExecuteLinkage = {
  linkage: FormBuilder.DefaultValueLinkage;
  formActions: ISchemaFormActions,
}

function executeLinkage({ linkage, formActions }: ExecuteLinkage) {
  const { setFieldState, getFieldValue } = formActions;
  const listenedOnFields: string[] = [];
  linkage.rules.forEach((rule) => {
    if (rule.compareTo === 'currentFormValue') {
      listenedOnFields.push(rule.compareValue);
    }
  });

  if (listenedOnFields.length === 0) {
    of(true).pipe(
      switchMap(() => fetchLinkedTableData$(getFieldValue, linkage)),
      map(({ response }) => response.data?.entities?.[0]),
      filter<Record<string, any>>((linkedRow: Record<string, any> | undefined) => {
        return shouldFireEffect({ linkedRow, linkage, getFieldValue });
      }),
    ).subscribe((linkedRow) => {
      logger.debug('execute defaultValueLinkage form field', linkage.targetField);
      setFieldState(linkage.targetField, (state) => state.value = linkedRow[linkage.linkedField]);
    });
    return;
  }

  // *(abc,def,gij)
  onFieldValueChange$(`*(${listenedOnFields.join(',')})`).pipe(
    debounceTime(200),
    filter(() => shouldFetchLinkedTableData(getFieldValue, linkage)),
    switchMap(() => fetchLinkedTableData$(getFieldValue, linkage)),
    map(({ response }) => response.data?.entities?.[0]),
    filter<Record<string, any>>((linkedRow: Record<string, any> | undefined) => {
      return shouldFireEffect({ linkedRow, linkage, getFieldValue });
    }),
  ).subscribe((linkedRow) => {
    logger.debug('execute defaultValueLinkage form field', linkage.targetField);
    setFieldState(linkage.targetField, (state) => state.value = linkedRow[linkage.linkedField]);
  });
}

export default function DefaultValueLinkageEffect(schema: ISchema, formActions: ISchemaFormActions) {
  findAllLinkages(schema).forEach((linkage) => {
    executeLinkage({ linkage, formActions });
  });
}
