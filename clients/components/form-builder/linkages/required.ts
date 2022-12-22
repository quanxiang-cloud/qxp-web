/* eslint-disable guard-for-in */
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import { compareOperatorMap } from '@c/form-builder/constants';

const { onFormInit$, onFormValuesChange$ } = FormEffectHooks;

const INIT_VALUE: Record<string, string| number | Array<string | number>> = {
  string: '',
  number: 0,
  object: [],
};

function getRequiredComparator(linkage: FormBuilder.RequiredLinkage): FormBuilder.Comparator {
  return (values: Record<string, any>): boolean => {
    const pairs: Array<[any, FormBuilder.CompareOperator, any]> = linkage.rules.map(({
      sourceKey, compareOperator, compareValue,
    }) => {
      return [values[sourceKey], compareOperator, compareValue];
    });

    return pairs[linkage.ruleJoinOperator].call(pairs, ([value, compareOperator, compareValue]) => {
      const executor = compareOperatorMap[compareOperator]?.comparator;
      return executor?.(value ?? INIT_VALUE[typeof compareValue], compareValue);
    });
  };
}

export default function requiredLinkageEffect(
  linkages: FormBuilder.RequiredLinkage[],
  { setFieldState }: ISchemaFormActions,
): void {
  let fieldObj: any = {};
  const pairs: Array<[FormBuilder.Comparator, Array<string>, boolean]> = linkages.map((linkages) => {
    const isRequired = !!linkages.isRequired;
    return [getRequiredComparator(linkages), linkages.targetKeys, isRequired];
  });

  onFormInit$().subscribe(({ values }) => {
    fieldObj = {};
    pairs.forEach(([comparator, targetKeys, isRequired]) => {
      const _isRequired = isRequired ? comparator(values) : !comparator(values);
      targetKeys.map((targetKey)=>{
        if (!fieldObj[targetKey]) {
          fieldObj[targetKey] = _isRequired;
        }
      });
    });
    for (const key in fieldObj) {
      setFieldState( `*(${key})`, (state) => state.required = fieldObj[key]);
    }
  });

  onFormValuesChange$().subscribe(({ values }) => {
    fieldObj = {};
    pairs.forEach(([comparator, targetKeys, isRequired]) => {
      const _isRequired = isRequired ? comparator(values) : !comparator(values);
      targetKeys.map((targetKey)=>{
        if (!fieldObj[targetKey]) {
          fieldObj[targetKey] = _isRequired;
        }
      });
    });
    for (const key in fieldObj) {
      setFieldState( `*(${key})`, (state) => state.required = fieldObj[key]);
    }
  });
}
