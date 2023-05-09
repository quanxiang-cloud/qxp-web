/* eslint-disable guard-for-in */
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import { compareOperatorMap } from '@c/form-builder/constants';

const { onFormInit$, onFormValuesChange$ } = FormEffectHooks;

const INIT_VALUE: Record<string, string| number | Array<string | number>> = {
  string: '',
  number: 0,
  object: [],
};

function getComparator(linkage: FormBuilder.VisibleHiddenLinkage): FormBuilder.Comparator {
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

export default function visibleHiddenLinkageEffect(
  linkages: FormBuilder.VisibleHiddenLinkage[],
  { setFieldState }: ISchemaFormActions,
): void {
  let fieldObj: any = {};
  const pairs: Array<[FormBuilder.Comparator, Array<string>, boolean]> = linkages.map((linkages) => {
    const isShow = !!linkages.isShow;
    return [getComparator(linkages), linkages.targetKeys, isShow];
  });

  onFormInit$().subscribe(({ values }) => {
    fieldObj = {};
    pairs.forEach(([comparator, targetKeys, isShow]) => {
      const isVisible = isShow ? comparator(values) : !comparator(values);
      targetKeys.map((targetKey)=>{
        // if (!fieldObj[targetKey]) {
        //   fieldObj[targetKey] = isVisible;
        // }
        fieldObj[targetKey] = !fieldObj[targetKey] ? [isVisible] : [...fieldObj[targetKey], isVisible];
      });
    });
    for (const key in fieldObj) {
      // setFieldState( `*(${key})`, (state) => state.visible = fieldObj[key]);
      setFieldState( `*(${key})`, (state) => state.visible = !fieldObj[key].includes(false));
    }
  });

  onFormValuesChange$().subscribe(({ values }) => {
    fieldObj = {};
    pairs.forEach(([comparator, targetKeys, isShow]) => {
      const isVisible = isShow ? comparator(values) : !comparator(values);
      targetKeys.map((targetKey)=>{
        // if (!fieldObj[targetKey]) {
        //   // fieldObj[targetKey] = isVisible;
        // }
        fieldObj[targetKey] = !fieldObj[targetKey] ? [isVisible] : [...fieldObj[targetKey], isVisible];
      });
    });
    for (const key in fieldObj) {
      setFieldState( `*(${key})`, (state) => state.visible = !fieldObj[key].includes(false));
    }
  });
}

