import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';
import { WorkFlowData } from '@flow/content/editor/type';

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
export function addWorkFlow({ queryKey }: QueryFunctionContext): Promise<WorkFlowData> {
  return httpClient<WorkFlowData>(
    '/api/v1/flow/addFlow',
    queryKey[1] as AddWorkFlow,
  );
}

export function getWorkFlowInfo({ queryKey }: QueryFunctionContext): Promise<WorkFlowData> {
  return httpClient<WorkFlowData>(`/api/v1/flow/flowInfo/${queryKey[1] as string}`);
}

export type SaveWorkFlowParamsType = {
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
  canCancelType?: number,
  canCancelNodes?: string,
};
export function saveWorkFlow(flowData: SaveWorkFlowParamsType): Promise<WorkFlowData> {
  return httpClient<WorkFlowData>(
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
export function updateWorkflow({ queryKey }: QueryFunctionContext): Promise<WorkFlowData> {
  return httpClient<WorkFlowData>(
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

export function getVariableList(flowId: string): Promise<Array<ProcessVariable>> {
  return httpClient<Array<ProcessVariable>>(`/api/v1/flow/getVariableList?id=${flowId}`);
}

export function saveFlowVariable(values: Omit<ProcessVariable, 'desc' | 'code'>): Promise<void> {
  return httpClient('/api/v1/flow/saveFlowVariable', values);
}

export function deleteFlowVariable(id: string): Promise<void> {
  return httpClient(`/api/v1/flow/deleteFlowVariable/${id}`);
}
