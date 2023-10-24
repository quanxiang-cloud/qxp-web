/* eslint-disable guard-for-in */
import { FormEffectHooks } from '@formily/antd';

import { compareOperatorMap } from '@c/form-builder/constants';
import moment from 'moment';

const { onFormInit$, onFormValuesChange$ } = FormEffectHooks;

const INIT_VALUE: Record<string, string| number | Array<string | number>> = {
  string: '',
  number: 0,
  object: [],
};

export function getSelectAllComparator(linkage: FormBuilder.SelectAllLinkage): FormBuilder.Comparator {
  return (values: Record<string, any>): boolean => {
    const pairs: Array<[any, FormBuilder.CompareOperator, any]> = linkage?.rules.map(({
      sourceKey, compareOperator, compareValue,
    }) => {
      return [values[sourceKey], compareOperator, compareValue];
    });

    return linkage?.ruleJoinOperator && pairs[linkage.ruleJoinOperator].call(pairs, ([value, compareOperator, compareValue]) => {
      const executor = compareOperatorMap[compareOperator]?.comparator;
      const leftValue = new Date(value);
      const rightValue = new Date(compareValue);
      if (leftValue instanceof Date && !isNaN(leftValue as any) &&
        rightValue instanceof Date && !isNaN(rightValue as any)) {
        const format = 'YYYY-MM-DD';
        return executor?.(moment(leftValue).format(format), moment(rightValue).format(format));
      } else {
        return executor?.(value ?? INIT_VALUE[typeof compareValue], compareValue);
      }
    });
  };
}

export default function selectAllLinkageEffect(
  linkages: FormBuilder.SelectAllLinkage,
  callBack?: any,
): void {
  const { rules } = linkages || {};
  const comparator: any = getSelectAllComparator(linkages);
  onFormInit$().subscribe(({ values }) => {
    const isSelectAll = comparator(values) && !!rules?.length;
    callBack && callBack(!!isSelectAll);
  });

  onFormValuesChange$().subscribe(({ values }) => {
    const isSelectAll = comparator(values) && !!rules?.length;
    callBack && callBack(!!isSelectAll);
  });
}
