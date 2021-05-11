interface Flow {
  bpmnText: string;
  canCancel: 0 | 1;
  canMsg: 0 | 1;
  canUrge: 0 | 1;
  canViewStatusMsg: 0 | 1;
  createTime: string;
  creatorId: string;
  id: string;
  isDeleted: 0 | 1;
  modifierId: string;
  modifierName: string;
  modifyTime: string;
  name: string;
  processKey: string;
  status: 'ENABLE' | 'DISABLE';
  triggerMode: 'FORM_DATA' | 'FORM_TIME';
}

interface FlowInstance {
  appId?: string;
  appName?: string;
  applyNo?: string;
  applyUserId?: string;
  blockStatus?: number;
  createTime?: string;
  creatorAvatar?: string;
  creatorId?: string;
  creatorName?: string;
  flowId?: string;
  formData?: object;
  formSchema?: {table: object};
  formId?: string;
  formInstanceId?: string;
  id?: string;
  isDeleted?: number;
  modifierId?: string;
  modifierName?: string;
  modifyTime?: string;
  name?: string;
  processInstanceId?: string;
  status?: string;
}
