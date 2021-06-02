export const OPERATORS_STRING = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '模糊',
    value: 'like',
  },
];

export const OPERATORS_NUMBER = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '大于等于',
    value: 'gte',
  },
  {
    label: '小于等于',
    value: 'lte',
  },
];

export const OPERATORS_DATE = [
  {
    label: '范围',
    value: 'range',
  },
];

export const OPERATORS_BOOL = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '不等于',
    value: 'ne',
  },
];

export const OPERATORS_ARRAY_MULTIPLE = [
  {
    label: '同时包含',
    value: 'eq',
  },
  {
    label: '包含任一一个',
    value: 'in',
  },
  {
    label: '不包含',
    value: 'not in',
  },
];

export const OPERATORS_LABEL_VALUE = [
  {
    label: '包含',
    value: 'in',
  },
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '不等于',
    value: 'ne',
  },
];

export const CONDITION = [
  {
    label: '所有',
    value: 'and',
  },
  {
    label: '任一',
    value: 'or',
  },
];

export function getOperators(type: string, enums: any[] | undefined) {
  if (enums && enums.length) {
    return OPERATORS_ARRAY_MULTIPLE;
  }

  switch (type) {
  case 'number':
    return OPERATORS_NUMBER;
  case 'datetime':
    return OPERATORS_DATE;
  case 'boolean':
    return OPERATORS_BOOL;
  case 'label-value':
    return OPERATORS_LABEL_VALUE;
  default:
    return OPERATORS_STRING;
  }
}
