type TriggerMode = 'FORM_DATA' | 'FORM_TIME';

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
  triggerMode: TriggerMode;
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
  formSchema?: {properties: Record<string, any>};
  formData?: Record<string, any>;
  formId?: string;
  formInstanceId?: string;
  id?: string;
  keyFields?: Array<string>;
  isDeleted?: number;
  modifierId?: string;
  modifierName?: string;
  modifyTime?: string;
  name?: string;
  processInstanceId?: string;
  status?: string;
}
