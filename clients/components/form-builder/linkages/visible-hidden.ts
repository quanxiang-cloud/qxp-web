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
      const executor = compareOperatorMap[compareOperator].comparator;
      return executor(value ?? INIT_VALUE[typeof compareValue], compareValue);
    });
  };
}

export default function visibleHiddenLinkageEffect(
  linkages: FormBuilder.VisibleHiddenLinkage[],
  { setFieldState }: ISchemaFormActions,
): void {
  const pairs: Array<[FormBuilder.Comparator, string, boolean]> = linkages.map((linkages) => {
    // *(abc,def,gij)
    const targetKeys = `*(${linkages.targetKeys.join(',')})`;
    const isShow = !!linkages.isShow;
    return [getComparator(linkages), targetKeys, isShow];
  });

  onFormInit$().subscribe(({ values }) => {
    pairs.forEach(([comparator, targetKey, isShow]) => {
      const isVisible = isShow ? comparator(values) : !comparator(values);
      setFieldState(targetKey, (state) => state.visible = isVisible);
    });
  });

  onFormValuesChange$().subscribe(({ values }) => {
    pairs.forEach(([comparator, targetKey, isShow]) => {
      const isVisible = isShow ? comparator(values) : !comparator(values);
      setFieldState(targetKey, (state) => state.visible = isVisible);
    });
  });
}
