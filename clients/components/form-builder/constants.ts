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
    op: 'ne',
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
    op: 'intersection',
    comparator: (leftValue: string | number, rightValue: Array<string | number>): boolean => {
      return rightValue.includes(leftValue);
    },
  },
  '∉': {
    title: '不属于',
    op: 'exclude',
    comparator: (leftValue: string | number, rightValue: Array<string | number>): boolean => {
      return !rightValue.includes(leftValue);
    },
  },
  '⊇': {
    title: '全部包含',
    op: 'fullSubset',
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
    op: 'range',
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

//  hidden write read
//  0      0     0     0    invisible = true
//  0      1     0     2  x invisible = true
//  1      0     0     4  x invisible = true
//  1      1     0     6  x invisible = true
//  1      0     1     5    invisible = true
//  1      1     1     7  x invisible = true
//  0      0     1     1    readOnly = true
//  0      1     1     3    normal = true

// editable hidden write read
// 0        0      0     0    invisible = true(0, 后端过滤)
// 1        0      0     0    x
// 0        1      0     0    x
// 0        0      1     0    x
// 0        0      0     1    readOnly = true(1, 提交时过滤)
// 1        1      0     0    x
// 1        0      1     0    x
// 1        0      0     1    x
// 0        1      1     0    x
// 0        1      0     1    invisible = true(5, 提交时过滤)
// 0        0      1     1    readOnly = true(3, 不过滤)
// 1        1      1     0    x
// 1        1      0     1    x
// 1        0      1     1    normal = true(11, 不过滤)
// 0        1      1     1    invisible = true(7, 不过滤)
// 1        1      1     1    x
export type INVALID_PERMISSION = 4 | 8 | 9;
export type PERMISSION = 0 | 1 | 3 | 5 | 7 | 11 | INVALID_PERMISSION;
export const INVISIBLE_NO_READ = 0;
export const INVISIBLE_NO_WRITE = 5;
export const INVISIBLE_WITH_WRITE = 7;
export const READONLY_NO_WRITE = 1;
export const READONLY_WITH_WRITE = 3;
export const NORMAL = 11;
export type PERMISSION_TYPE = {
  read: boolean;
  write: boolean;
  invisible: boolean;
  editable: boolean;
  readonly: boolean
};
export type PERMISSION_KEY = keyof PERMISSION_TYPE;

export const INVALID_READONLY = 0;
export const INVALID_INVISIBLE = 4;
export const INVALID_NORMAL = 8;
export const INVALID_READONLY_LEGACY = 9;

/** form-builder internal fields map */
export const INTERNAL_FIELDS: Array<FormItem> = [
  {
    fieldName: '_id',
    componentName: 'Input',
    configValue: {
      displayModifier: 'hidden',
      title: 'id',
      isSystem: true,
      type: 'string',
      'x-component-props': {},
    },
  },
  {
    fieldName: 'created_at',
    componentName: 'DatePicker',
    configValue: {
      displayModifier: 'hidden',
      title: '创建时间',
      isSystem: true,
      type: 'datetime',
      'x-component-props': { isNow: false, showTime: false, style: { width: '100%' } },
    },
  },
  {
    fieldName: 'updated_at',
    componentName: 'DatePicker',
    configValue: {
      displayModifier: 'hidden',
      title: '修改时间',
      isSystem: true,
      type: 'datetime',
      'x-component-props': { isNow: false, showTime: false, style: { width: '100%' } },
    },
  },
  {
    fieldName: 'creator_name',
    componentName: 'Input',
    configValue: {
      displayModifier: 'hidden',
      title: '创建者',
      isSystem: true,
      type: 'string',
      'x-component-props': {},
    },
  },
  {
    fieldName: 'creator_id',
    componentName: 'Input',
    configValue: {
      displayModifier: 'hidden',
      title: '创建者 ID',
      isSystem: true,
      type: 'string',
      'x-component-props': {},
    },
  },
  {
    fieldName: 'modifier_name',
    componentName: 'Input',
    configValue: {
      displayModifier: 'hidden',
      title: '修改者',
      isSystem: true,
      type: 'string',
      'x-component-props': {},
    },
  },
  {
    fieldName: 'modifier_id',
    componentName: 'Input',
    configValue: {
      displayModifier: 'hidden',
      title: '修改者 ID',
      isSystem: true,
      type: 'string',
      'x-component-props': {},
    },
  },
];
