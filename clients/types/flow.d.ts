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
