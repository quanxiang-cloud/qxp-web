import httpClient from '@lib/http-client';
import { QueryFunctionContext } from 'react-query';

interface WorkFlow {
  bpmnText: string;
  canCancel: '0' | '1';
  canMsg: '0' | '1';
  canUrge: '0' | '1';
  canViewStatusMsg: '0' | '1';
  createTime: string;
  creatorAvatar: string;
  creatorId: string;
  creatorName: string;
  id: string;
  isDeleted: '0' | '1';
  modifierId: string;
  modifierName: string;
  modifyTime: string;
  name:string;
  processKey:string;
  status: string;
  triggerMode: 'FORM_DATA' | 'FORM_TIME';
}

interface AddWorkFlow {
  bpmnText: string;
  canCancel: '0' | '1';
  canMsg: '0' | '1';
  canUrge: '0' | '1';
  canViewStatusMsg: '0' | '1';
  creatorId: string;
  name: string;
  processKey: string;
  triggerMode: 'FORM_DATA' | 'FORM_TIME';
}
export function addWorkFlow({ queryKey }: QueryFunctionContext) {
  return httpClient<WorkFlow>(
    '/api/v1/flow/addFlow',
    queryKey[1] as AddWorkFlow,
  );
}

export function getWorkFlowInfo({ queryKey }: QueryFunctionContext) {
  return httpClient<WorkFlow>(`/api/v1/flow/flowInfo/${queryKey[1] as string}`);
}

interface SaveWorkFlow {
  bpmnText: string;
  id: string;
}
export function saveWorkFlow({ queryKey }: QueryFunctionContext) {
  return httpClient<WorkFlow>(
    '/api/v1/flow/saveFlowBpmn',
    queryKey[1] as SaveWorkFlow,
  );
}

interface UpdateWorkFlow {
  bpmnText: string;
  canCancel: '0' | '1';
  canMsg: '0' | '1';
  canUrge: '0' | '1';
  canViewStatusMsg: '0' | '1';
  name: string;
  modifierId: string;
}
export function updateWorkflow({ queryKey }: QueryFunctionContext) {
  return httpClient<WorkFlow>(
    '/api/v1/flow/updateFlow',
    queryKey[1] as UpdateWorkFlow,
  );
}

export function ToggleWorkFlow({ queryKey }: QueryFunctionContext) {
  return httpClient('/api/v1/flow/updateFlowStatus', queryKey[1] as {
    id: string;
    status: 'enabled' | 'disabled';
  });
}
