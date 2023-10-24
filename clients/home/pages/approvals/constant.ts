export enum TaskHandleType {
  agree = 'AGREE',
  refuse = 'REFUSE',
  fill_in = 'FILL_IN',
  cancel = 'CANCEL',
  deliver = 'DELIVER',
  step_back = 'STEP_BACK',
  send_back = 'SEND_BACK',
  cc = 'CC',
  add_sign = 'ADD_SIGN',
  read = 'READ',

  // global actions
  canMsg = 'canMsg',
  canViewStatusAndMsg = 'canViewStatusAndMsg',
  hasCancelBtn = 'hasCancelBtn',
  hasCcHandleBtn = 'hasCcHandleBtn',
  hasReadHandleBtn = 'hasReadHandleBtn',
  hasResubmitBtn = 'hasResubmitBtn',
  hasUrgeBtn = 'hasUrgeBtn',
}

export const APPROVAL = 'approval';
export const FILL_IN = 'fillIn';
export const listData = [
  {
    label: '审批',
    value: 'approval',
  },
  {
    label: '填写',
    value: 'fillIn',
  },
];
