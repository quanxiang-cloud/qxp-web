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

export interface SaveWorkFlow {
  bpmnText: string;
  id?: string;
  name: string;
  triggerMode: string;
  canCancel: 0 | 1;
  canMsg: 0 | 1;
  canUrge: 0 | 1;
  canViewStatusMsg: 0 | 1;
  appId: string;
}
export function saveWorkFlow(flowData: SaveWorkFlow) {
  return httpClient<WorkFlow>(
    '/api/v1/flow/saveFlow',
    flowData,
  );
}

interface UpdateWorkFlow {
  bpmnText: string;
  canCancel: 0 | 1;
  canMsg: 0 | 1;
  canUrge: 0 | 1;
  canViewStatusMsg: 0 | 1;
  name: string;
  modifierId: string;
}
export function updateWorkflow({ queryKey }: QueryFunctionContext) {
  return httpClient<WorkFlow>(
    '/api/v1/flow/updateFlow',
    queryKey[1] as UpdateWorkFlow,
  );
}

export function toggleWorkFlow(data: {
    id: string;
    status: 'ENABLE' | 'DISABLE';
}) {
  return httpClient('/api/v1/flow/updateFlowStatus', data);
}
