interface Flow {
  bpmnText: string;
  createTime: string;
  creatorId: string;
  id: '0' | '1';
  isDeleted: number;
  modifierId: string;
  modifierName: string;
  modifyTime: string;
  name: string;
  processKey: string;
  status: 'ENABLE' | 'DISABLE';
  triggerMode: 'FORM_DATA' | 'FORM_TIME';
}
