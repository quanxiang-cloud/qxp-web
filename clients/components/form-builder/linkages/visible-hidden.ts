import { createFormActions, FormEffectHooks } from '@formily/antd';

const { onFormInit$, onFormValuesChange$ } = FormEffectHooks;

function getComparator(linkage: FormBuilder.VisibleHiddenLinkage): FormBuilder.Comparator {
  return (values: Record<string, any>): boolean => {
    const pairs = linkage.rules.map(({ sourceKey, compareOperator, compareValue }) => {
      return [values[sourceKey], compareOperator, compareValue];
    });

    return pairs[linkage.ruleJoinOperator].call(pairs, ([value, compareOperator, compareValue]) => {
      // 策略模式
      const strategys: Record<string, Function> = {
        isInclusion: () => {
          const source = value.length > 1 ? value.join('\',\'') : value;
          const result = compareValue.length > 1 ? compareValue.join('\',\'') : compareValue;
          const bodyStrategy: Record<string, string> = {
            '∈': `return [\'${result}\'].every((val) => [\'${source}\'].includes(val))`,
            '∉': `return [\'${result}\'].every((val) => ![\'${source}\'].includes(val))`,
            '===': `return [\'${result}\'].length === [\'${source}\'].length && [\'${result}\'].every((val) => [\'${source}\'].includes(val))`,
            '!==': `return [\'${result}\'].length !== [\'${source}\'].length || [\'${result}\'].every((val) => ![\'${source}\'].includes(val))`,
          };
          return bodyStrategy[compareOperator] ?? `return value ${compareOperator} compareValue`;
        },
        isInitInclusion: () => {
          const bodyStrategy: Record<string, string> = {
            '∈': 'return value === compareValue',
            '∉': 'return value !== compareValue',
          };
          return bodyStrategy[compareOperator] ?? `return value ${compareOperator} compareValue`;
        },
      };

      const keys = [
        (typeof value === 'object' && typeof compareValue === 'object') ? 'isInclusion' : '',
        value === undefined ? 'isInitInclusion' : '',
      ];

      const executors = keys.map((key) => {
        return strategys[key];
      }).find((executor) => executor !== undefined);

      const body = executors ? executors() : `return value ${compareOperator} compareValue`;

      const executor = new Function('value', 'compareValue', body);
      return executor(value, compareValue);
    });
  };
}

export default function visibleHiddenLinkageEffect(linkages: FormBuilder.VisibleHiddenLinkage[]) {
  const { setFieldState } = createFormActions();

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
