export const WORK_TABLE_INTERNAL_FIELDS = [
  '_id',
  'created_at',
  'updated_at',
  'creator_name',
  'modifier_name',
  'modifier_id',
  'creator_id',
];

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
  {
    enabled: false, // common
    changeable: true,
    name: '撤回',
    text: '撤回',
    value: 'CANCEL',
  },
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
