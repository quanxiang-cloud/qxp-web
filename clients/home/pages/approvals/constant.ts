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
