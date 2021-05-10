import FormBuilder from './form-builder';
import registry from './registry';

import './index.scss';
import { createFormActions, FormEffectHooks } from '@formily/antd';

const { onFormValuesChange$ } = FormEffectHooks;

function getComparator(linkage: VisibleHiddenLinkage): Comparator {
  return (values: Record<string, any>): boolean => {
    const pairs = linkage.rules.map(({ sourceKey, compareOperator, compareValue }) => {
      return [values[sourceKey], compareOperator, compareValue];
    });

    return pairs[linkage.ruleJoinOperator].call(pairs, ([value, compareOperator, compareValue]) => {
      const executor = new Function('value', 'compareValue', `return value ${compareOperator} compareValue`);
      return executor(value, compareValue);
    });
  };
}

function visibleHiddenLinkageEffect(linkages: VisibleHiddenLinkage[]) {
  const { setFieldState } = createFormActions();

  const comparatorsAndTargetKey: Array<[Comparator, string]> = linkages.map((linkages) => {
    // *(abc,def,gij)
    const targetKeys = `*(${linkages.targetKeys.join(',')})`;
    return [getComparator(linkages), targetKeys];
  });

  onFormValuesChange$().subscribe(({ values }) => {
    comparatorsAndTargetKey.forEach(([comparator, targetKey]) => {
      const isVisible = comparator(values);
      setFieldState(targetKey, (state) => state.visible = isVisible);
    });
  });
}

export default FormBuilder;

export {
  FormBuilder,
  registry,
  visibleHiddenLinkageEffect,
};
