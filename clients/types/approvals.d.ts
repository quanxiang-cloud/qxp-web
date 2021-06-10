type ApprovalTask = {
  id: string; // task id

  name: string; // task name

  description?: string;

  createTime: string; // Task create time

  startTime?: string;

  endTime?: string; // Task end time

  flowInstanceEntity: FlowInstance;

  processInstanceId?: string;

  assignee?: string; // Assignee user id

  deleteReason?: string; // Delete reason

  dueDate?: string; // Task due date

  durationInMillis?: number; // Task duration time
};

type TaskFormData = Record<string, any>;

type TaskForm = {
  form: { table: ISchema },
  formData: TaskFormData;
}

declare enum TaskHandleType {
  agree = 'AGREE',
  refuse = 'REFUSE',
  fill_in = 'FILL_IN',
  // cancel = 'CANCEL',
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

type PermissionItem = {
  enabled: boolean;
  name?: string;
  value: TaskHandleType;
  text?: string;
  defaultText?: string;
  changeable?: boolean;
}
