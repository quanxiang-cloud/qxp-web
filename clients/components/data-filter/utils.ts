import { unitOfTime, Moment } from 'moment';

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
    value: 'between',
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
    value: 'fullSubset',
  },
  {
    label: '包含任一一个',
    value: 'intersection',
  },
];

export const OPERATORS_LABEL_VALUE = [
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

export function getOperators(type: string, enums: any[] | undefined): LabelValue[] {
  switch (type) {
  case 'array':
    return OPERATORS_ARRAY_MULTIPLE;
  case 'number':
    return OPERATORS_NUMBER;
  case 'datetime':
    return OPERATORS_DATE;
  case 'boolean':
    return OPERATORS_BOOL;
  case 'label-value':
    return OPERATORS_LABEL_VALUE;
  default:
    if (enums && enums.length) {
      return OPERATORS_ARRAY_MULTIPLE;
    }

    return OPERATORS_STRING;
  }
}

export const FILTER_FIELD = [
  'DatePicker',
  'Input',
  'MultipleSelect',
  'NumberPicker',
  'RadioGroup',
  'textarea',
  'Select',
  'CheckboxGroup',
  'UserPicker',
  'CascadeSelector',
  'OrganizationPicker',
];

function getDateType(format: string): unitOfTime.StartOf {
  switch (format) {
  case 'YYYY':
    return 'year';
  case 'YYYY-MM':
    return 'month';
  case 'YYYY-MM-DD':
    return 'day';
  case 'YYYY-MM-DD HH:mm':
    return 'minute';
  case 'YYYY-MM-DD HH:mm:ss':
    return 'second';
  default:
    return 'day';
  }
}

type LabelValue = {
  label: string;
  value: string;
}

type Value = string
  | string[]
  | Record<string, unknown>
  | Record<string, unknown>[]
  | number
  | number[]
  | LabelValue[]
  | Moment[];

export function getCondition(schema: ISchema, value: Value, key: string, op?: string): Condition {
  const _condition: Condition = { key };
  switch (schema['x-component']) {
  case 'DatePicker': {
    const [start, end] = value as Moment[];
    const format = schema?.['x-component-props']?.format || 'YYYY-MM-DD';
    _condition.value = [
      start.startOf(getDateType(format)).toISOString(),
      end.endOf(getDateType(format)).toISOString(),
    ];
    _condition.op = op || 'between';
    break;
  }
  case 'NumberPicker':
    _condition.value = [Number(value)];
    _condition.op = op || 'eq';
    break;
  case 'MultipleSelect':
  case 'RadioGroup':
  case 'CheckboxGroup':
  case 'UserPicker':
  case 'Select':
    _condition.value = value as any[];
    _condition.op = op || 'intersection';
    break;
  case 'CascadeSelector':
    _condition.value = [value as LabelValue];
    _condition.op = op || 'eq';
    break;
  default:
    if (Array.isArray(value)) {
      _condition.value = value as any[];
      _condition.op = op || 'intersection';
    } else {
      _condition.value = [value as string | number];
      _condition.op = op || 'like';
    }
    break;
  }

  return _condition;
}
