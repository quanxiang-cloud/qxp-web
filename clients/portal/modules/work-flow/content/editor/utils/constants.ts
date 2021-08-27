import type { FieldOperatorOptions } from '@flowEditor/type';

export const CURRENT_WORK_FLOW_VERSION = '0.2';

export const SYSTEM_OPERATOR_PERMISSION = [
  {
    enabled: true,
    changeable: false,
    name: '通过',
    text: '通过',
    value: 'AGREE',
    only: 'approve',
    reasonRequired: false,
  },
  {
    enabled: true,
    changeable: false,
    name: '拒绝',
    text: '拒绝',
    value: 'REFUSE',
    only: 'approve',
    reasonRequired: true,
  },
  {
    enabled: true,
    changeable: false,
    name: '提交',
    text: '提交',
    value: 'FILL_IN',
    only: 'fillIn',
  },
];

export const CUSTOM_OPERATOR_PERMISSION = [
  // {
  //   enabled: false, // common
  //   changeable: true,
  //   name: '撤回',
  //   text: '撤回',
  //   value: 'CANCEL',
  // },
  {
    enabled: false, // common
    changeable: true,
    name: '转交',
    text: '转交',
    value: 'DELIVER',
  },
  {
    enabled: false,
    changeable: true,
    name: '回退',
    text: '回退',
    value: 'STEP_BACK',
    only: 'approve',
  },
  {
    enabled: false,
    changeable: true,
    name: '打回重填',
    text: '打回重填',
    value: 'SEND_BACK',
    only: 'approve',
  },
  {
    enabled: false, // common
    changeable: true,
    name: '抄送',
    text: '抄送',
    value: 'CC',
  },
  {
    enabled: false,
    changeable: true,
    name: '加签',
    text: '加签',
    value: 'ADD_SIGN',
    only: 'approve',
  },
  {
    enabled: false, // common
    changeable: true,
    name: '邀请阅示',
    text: '邀请阅示',
    value: 'READ',
  },
];

export const COMPONENT_OPERATORS_MAP = {
  input: ['eq', 'neq', 'include', 'not-include', 'null', 'not-null'],
  textarea: ['include', 'not-include', 'null', 'not-null'],
  radiogroup: ['eq'],
  select: ['eq', 'neq', 'null', 'not-null'],
  multipleselect: ['any', 'all', 'null', 'not-null'],
  datepicker: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'range'],
  numberpicker: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte'],
  default: [
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'null', 'not-null', 'any', 'all', 'include', 'not-include',
  ],
};

export const OPERATOR_OPTIONS: FieldOperatorOptions = [
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '大于等于',
    value: 'gte',
  },
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '小于等于',
    value: 'lte',
  },
  {
    label: '不等于',
    value: 'neq',
  },
  {
    label: '为空',
    value: 'null',
  },
  {
    label: '不为空',
    value: 'not-null',
  },
  {
    label: '包含',
    value: 'include',
  },
  {
    label: '不包含',
    value: 'not-include',
  },
  {
    label: '包含任意一个',
    value: 'any',
  },
  {
    label: '同时包含',
    value: 'all',
  },
  {
    label: '选择范围',
    value: 'range',
  },
];

export const TRIGGER_CONDITION_EXCLUDE_FIELD_NAMES = ['_id', 'creator_id', 'modifier_id'];

export const FORM_COMPONENT_VARIABLE_MAP: Record<string, FlowVariableFieldType[]> = {
  input: ['TEXT', 'BOOLEAN'],
  textarea: ['TEXT', 'BOOLEAN'],
  radiogroup: [],
  checkboxgroup: [],
  numberpicker: ['NUMBER'],
  datepicker: ['DATE'],
  select: [],
  multipleselect: [],
  organizationpicker: [],
  imageupload: [],
  cascadeselector: [],
  userpicker: [],
};

export const FLOW_VARIABLE_FIELD_TYPES: { value: FlowVariableFieldType; label: string }[] = [
  { value: 'TEXT', label: '文本型' },
  { value: 'NUMBER', label: '数值型' },
  { value: 'BOOLEAN', label: '布尔型' },
  { value: 'DATE', label: '日期型' },
];
