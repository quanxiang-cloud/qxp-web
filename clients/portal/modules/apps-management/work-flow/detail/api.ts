import httpClient from '@lib/http-client';
import { QueryFunctionContext } from 'react-query';

interface WorkFlow {
  bpmnText: string;
  canCancel: '0' | '1' | 1 | 0;
  canMsg: '0' | '1' | 1 | 0;
  canUrge: '0' | '1' | 0 | 1;
  canViewStatusMsg: '0' | '1' | 1 | 0;
  createTime: string;
  creatorAvatar: string;
  creatorId: string;
  creatorName: string;
  id: string;
  isDeleted: '0' | '1';
  modifierId: string;
  modifierName: string;
  modifyTime: string;
  name: string;
  processKey: string;
  status: string;
  triggerMode: 'FORM_DATA' | 'FORM_TIME';
  keyFields: string;
  instanceName: string;
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
export function addWorkFlow({ queryKey }: QueryFunctionContext): Promise<WorkFlow> {
  return httpClient<WorkFlow>(
    '/api/v1/flow/addFlow',
    queryKey[1] as AddWorkFlow,
  );
}

export function getWorkFlowInfo({ queryKey }: QueryFunctionContext): Promise<WorkFlow> {
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
  keyFields?: string;
  instanceName?: string;
}
export function saveWorkFlow(flowData: SaveWorkFlow): Promise<WorkFlow> {
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
export function updateWorkflow({ queryKey }: QueryFunctionContext): Promise<WorkFlow> {
  return httpClient<WorkFlow>(
    '/api/v1/flow/updateFlow',
    queryKey[1] as UpdateWorkFlow,
  );
}

export function toggleWorkFlow(data: {
  id: string;
  status: 'ENABLE' | 'DISABLE';
}): Promise<unknown> {
  return httpClient('/api/v1/flow/updateFlowStatus', data);
}

