import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import compareOperatorMap from './compare-operator-map';

const { onFormInit$, onFormValuesChange$ } = FormEffectHooks;

function getComparator(linkage: FormBuilder.VisibleHiddenLinkage): FormBuilder.Comparator {
  return (values: Record<string, any>): boolean => {
    const pairs: Array<[any, FormBuilder.CompareOperator, any]> = linkage.rules.map(({ sourceKey, compareOperator, compareValue }) => {
      return [values[sourceKey], compareOperator, compareValue];
    });

    return pairs[linkage.ruleJoinOperator].call(pairs, ([value, compareOperator, compareValue]) => {
      if (value !== undefined) {
        const executor = compareOperatorMap[compareOperator].comparator;
        return executor(value, compareValue);
      }

      const not = ['!=', '∉', '⊋'];
      if (value === undefined) {
        return not.includes(compareOperator);
      }

      return false;
    });
  };
}

export default function visibleHiddenLinkageEffect(
  linkages: FormBuilder.VisibleHiddenLinkage[],
  { setFieldState }: ISchemaFormActions,
) {
  const comparatorsAndTargetKey: Array<[FormBuilder.Comparator, string, boolean]> = linkages.map((linkages) => {
    // *(abc,def,gij)
    const targetKeys = `*(${linkages.targetKeys.join(',')})`;
    const isShow = linkages.isShow;
    return [getComparator(linkages), targetKeys, isShow];
  });

  onFormInit$().subscribe(({ values }) => {
    comparatorsAndTargetKey.forEach(([comparator, targetKey, isShow]) => {
      const isVisible = isShow === true ? comparator(values) : !comparator(values);
      setFieldState(targetKey, (state) => state.visible = isVisible);
    });
  });

  onFormValuesChange$().subscribe(({ values }) => {
    comparatorsAndTargetKey.forEach(([comparator, targetKey, isShow]) => {
      const isVisible = isShow === true ? comparator(values) : !comparator(values);
      setFieldState(targetKey, (state) => state.visible = isVisible);
    });
  });
}
