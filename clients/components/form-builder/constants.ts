export const OPERATORS = {
  Default: [
    { value: '==', label: '等于' },
    { value: '!=', label: '不等于' },
  ],
  Multiple: [
    { value: '⊇', label: '全部包含' },
    { value: '∩', label: '任一' },
  ],
  Single: [
    { value: '==', label: '等于' },
    { value: '!=', label: '不等于' },
    // { value: '∈', label: '属于' },
    // { value: '∉', label: '不属于' },
  ],
  Date: [
    { value: '==', label: '等于' },
    { value: '!=', label: '不等于' },
    { value: '<', label: '早于' },
    { value: '>', label: '晚于' },
  ],
  Number: [
    { value: '==', label: '等于' },
    { value: '!=', label: '不等于' },
    { value: '>', label: '大于' },
    { value: '<', label: '小于' },
    { value: '>=', label: '大于等于' },
    { value: '<=', label: '小于等于' },
  ],
};

export const OperatorOptions: Record<string, any> = {
  MultipleSelect: OPERATORS.Multiple,
  CheckboxGroup: OPERATORS.Multiple,
  RadioGroup: OPERATORS.Single,
  Select: OPERATORS.Single,
  DatePicker: OPERATORS.Date,
  NumberPicker: OPERATORS.Number,
  Default: OPERATORS.Default,
  Input: OPERATORS.Default,
};

type Comparator = (leftValue: any, rightValue: any) => boolean;
type OperatorContext = { op: string; title: string; comparator: Comparator; };

export const compareOperatorMap: Record<FormBuilder.CompareOperator, OperatorContext> = {
  '==': {
    title: '等于',
    op: 'eq',
    comparator: (leftValue: string | number, rightValue: string | number): boolean => {
      return leftValue === rightValue;
    },
  },
  '!=': {
    title: '不等于',
    op: 'not eq',
    comparator: (leftValue: string | number, rightValue: string | number): boolean => {
      return leftValue !== rightValue;
    },
  },
  '>': {
    title: '大于',
    op: 'gt',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue > rightValue;
    },
  },
  '>=': {
    title: '大于等于',
    op: 'gte',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue >= rightValue;
    },
  },
  '<': {
    title: '小于',
    op: 'lt',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue < rightValue;
    },
  },
  '<=': {
    title: '小于等于',
    op: 'lte',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue <= rightValue;
    },
  },
  '∈': {
    title: '属于',
    op: 'in',
    comparator: (leftValue: string | number, rightValue: Array<string | number>): boolean => {
      return rightValue.includes(leftValue);
    },
  },
  '∉': {
    title: '不属于',
    op: 'not in',
    comparator: (leftValue: string | number, rightValue: Array<string | number>): boolean => {
      return !rightValue.includes(leftValue);
    },
  },
  '⊇': {
    title: '全部包含',
    op: 'include',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return rightValue.every((value) => {
        return leftValue.includes(value);
      });
    },
  },
  '⊋': {
    title: '不包含',
    op: 'exclude',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return rightValue.find((value) => {
        return !leftValue.includes(value);
      }) ? true : false;
    },
  },
  '∩': {
    title: '任一',
    op: 'intersection',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return rightValue.find((value) => {
        return leftValue.includes(value);
      }) ? true : false;
    },
  },
  '~': {
    title: '相似',
    op: 'like',
    comparator: (leftValue: string, rightValue: string): boolean => {
      return leftValue.toLowerCase().includes(rightValue.toLowerCase());
    },
  },
  '()': {
    title: '在范围内',
    op: 'between',
    comparator: (leftValue: number, rightValue: [number, number]): boolean => {
      return leftValue > rightValue[0] && leftValue < rightValue[1];
    },
  },
};

export const SYSTEM_FIELDS = [
  '_id',
  'created_at',
  'updated_at',
  'creator_name',
  'modifier_name',
  'modifier_id',
  'creator_id',
];

// hidden write read
//  0    0     0    0    invisible = true
//  0    1     0    2  x invisible = true
//  1    0     0    4  x invisible = true
//  1    1     0    6  x invisible = true
//  1    0     1    5    invisible = true
//  1    1     1    7  x invisible = true
//  0    0     1    1    readOnly = true
//  0    1     1    3    normal = true
export type PERMISSION = 0 | 1 | 3 | 5;
export const READONLY = 1;
