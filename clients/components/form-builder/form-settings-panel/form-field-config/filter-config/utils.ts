import { useState, useEffect } from 'react';

function getConditions(initConditions: Condition[], getFieldValue: (path: string) => any): Condition[] {
  return initConditions.reduce((acc, conditionItem) => {
    let value;
    if (
      conditionItem.valueFrom === 'form' &&
      (value = getFieldValue(conditionItem.value?.toString() || ''))
    ) {
      return acc.concat({ ...conditionItem, value: Array.isArray(value) ? value : [value] });
    }

    return acc;
  }, [] as Condition[]);
}

export function useGetLinkageFilterConfig(
  initFilterConfig: FilterConfig | undefined,
  getFieldValue: (path: string) => any,
): FilterConfig | undefined {
  const [subscribeFields, setSub] = useState<Condition[]>([]);

  useEffect(() => {
    if (!initFilterConfig) {
      return;
    }

    setSub(
      initFilterConfig.condition.filter(({ valueFrom }: Condition) => {
        return valueFrom === 'form';
      }),
    );
  }, [initFilterConfig]);

  if (!initFilterConfig) {
    return undefined;
  }

  return subscribeFields.length ? {
    tag: initFilterConfig?.tag || 'and',
    condition: getConditions(initFilterConfig?.condition as [], getFieldValue),
  } : initFilterConfig;
}
