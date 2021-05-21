import { createFormActions, FormEffectHooks } from '@formily/antd';

const { onFormValuesChange$ } = FormEffectHooks;

function getComparator(linkage: FormBuilder.VisibleHiddenLinkage): FormBuilder.Comparator {
  return (values: Record<string, any>): boolean => {
    const pairs = linkage.rules.map(({ sourceKey, compareOperator, compareValue }) => {
      return [values[sourceKey], compareOperator, compareValue];
    });

    return pairs[linkage.ruleJoinOperator].call(pairs, ([value, compareOperator, compareValue]) => {
      let body = `return value ${compareOperator} compareValue`;

      if (typeof value === 'object' && typeof compareValue === 'object') {
        switch (compareOperator) {
        case '∈':
          const sourceInclude = value.length > 1 ? value.join('\',\'') : value;
          const resultInclude = compareValue.length > 1 ? compareValue.join('\',\'') : compareValue;
          body = `return [\'${resultInclude}\'].every((val) => [\'${sourceInclude}\'].includes(val))`;
          break;
        case '∉':
          const sourceExclude = value.length > 1 ? value.join('\',\'') : value;
          const resultExclude = compareValue.length > 1 ? compareValue.join('\',\'') : compareValue;
          body = `return [\'${resultExclude}\'].every((val) => ![\'${sourceExclude}\'].includes(val))`;
          break;
        default:
          body = `return value ${compareOperator} compareValue`;
          break;
        }
      }

      if (value === undefined) {
        switch (compareOperator) {
        case '∈':
          body = 'return value === compareValue';
          break;
        case '∉':
          body = 'return value !== compareValue';
          break;
        default:
          body = `return value ${compareOperator} compareValue`;
          break;
        }
      }

      const executor = new Function('value', 'compareValue', body);
      return executor(value, compareValue);
    });
  };
}

export default function visibleHiddenLinkageEffect(linkages: FormBuilder.VisibleHiddenLinkage[]) {
  const { setFieldState } = createFormActions();

  const comparatorsAndTargetKey: Array<[FormBuilder.Comparator, string]> = linkages.map((linkages) => {
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
