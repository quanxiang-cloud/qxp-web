/* eslint-disable no-plusplus */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-case-declarations */
import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';
import { WorkFlowData } from '@newFlow/content/editor/type';
import { getPipelineWorkFlowParams } from './util';

export function getWorkFlowInfo({ queryKey }: QueryFunctionContext): Promise<WorkFlowData> {
  return httpClient<WorkFlowData>(`/api/v1/flow/flowInfo/${queryKey[1] as string}`);
}

// 获取流程详情
export function getPipelineWorkFlowInfo({ queryKey }: QueryFunctionContext): Promise<WorkFlowData> {
  return httpClient.get<WorkFlowData>(`/api/v1/pipeline/${queryKey[1] as string}`);
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
  cron?: string,
};

// 创建/修改流程
export function saveWorkFlow(flowData: SaveWorkFlowParamsType): Promise<WorkFlowData> {
  const pipelineFlowData = getPipelineWorkFlowParams(flowData);
  return httpClient<WorkFlowData>('/api/v1/pipeline/node', pipelineFlowData);
}

export function toggleWorkFlow(data: any): Promise<unknown> {
  if (data?.status === 'ENABLE') {
    return enableTrigger(data);
  } else {
    return disableTrigger(data);
  }
}

// 查询触发器
export function getTriggerInfo(name: any): Promise<unknown> {
  return httpClient.get(`/api/v1/trigger/form/${name}`);
}

// 保存触发器
export function createTrigger(data: any): Promise<unknown> {
  return httpClient('/api/v1/trigger/form', data);
}

// 删除触发器
export function deleteTrigger(name: any): Promise<unknown> {
  return httpClient.delete(`/api/v1/trigger/form/${name}`);
}

// 上线
export function enableTrigger(data: any): Promise<unknown> {
  return httpClient(`/api/v1/trigger/${data?.params?.name}`, data?.params);
}
// 下线
export function disableTrigger(data: any): Promise<unknown> {
  return httpClient.delete(`/api/v1/trigger/${data?.name}`);
}

export function getVariableList(flowId: string) {
  return httpClient.get<WorkFlowData>(`/api/v1/pipeline/${flowId}`);
}

export function saveFlowVariable(values: Omit<ProcessVariable, 'desc' | 'code'>): Promise<void> {
  const variable = window.PipelineFlowData?.variable || [];
  const { displayName: display_name, appID, name, spec, config } = window.PipelineFlowData || {};
  const hasValue = variable?.find((item: any)=>item?.id === values?.id);
  !hasValue && variable.push(values);
  const _variable = variable?.map((item: any)=>{
    if (item.id === values.id) {
      return values;
    } else {
      return item;
    }
  });
  const pipelineFlowData = {
    display_name,
    appID,
    name,
    spec,
    config,
    variable: _variable,
  };
  return httpClient('/api/v1/pipeline/node', pipelineFlowData).then((res: any)=>{
    window.PipelineFlowData.variable = _variable;
    return res;
  });
}

export function deleteFlowVariable(id: string): Promise<void> {
  let variable = window.PipelineFlowData?.variable || [];
  const { displayName: display_name, appID, name, spec, config } = window.PipelineFlowData || {};
  variable = variable.filter((item: any)=>item.id !== id);
  const pipelineFlowData = {
    display_name,
    appID,
    name,
    spec,
    config,
    variable,
  };
  return httpClient('/api/v1/pipeline/node', pipelineFlowData).then((res: any)=>{
    window.PipelineFlowData.variable = variable;
    return res;
  });
}

// 删除流程
export function deletePipelineFlow(pid: string): Promise<any> {
  return httpClient.delete(`/api/v1/pipeline/${pid}`);
}

// 更新上线 下线 状态
export function updateStatus(pipelineFlowData: any) {
  return httpClient('/api/v1/pipeline/node', pipelineFlowData);
}

