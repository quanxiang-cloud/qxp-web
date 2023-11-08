/* eslint-disable max-len */
import { action, observable } from 'mobx';

import { FlowInstanceFormResponse, TaskDetail } from '../types';
import toast from '@lib/toast';

import { mapTaskDetail } from './utils';
import { FILL_IN } from '@home/pages/approvals/constant';
import { isNumber } from 'lodash';
import { getPipelineApproveProcessInfo, getPipelineFillInProcessInfo, getPipelineFormData, getPipelineFormSchemaInfo, getPipelineInfo } from '@home/pages/new-approvals/api';
import { buildQueryRef } from '@lib/http-client-form';

const formatPipelineDetail = async (processInstanceId: any, { type, taskId, taskType }: any)=>{
  const api = taskType === FILL_IN ? getPipelineFillInProcessInfo : getPipelineApproveProcessInfo;
  const pipelineProcess = await api(processInstanceId);
  const data = pipelineProcess?.Data || pipelineProcess;
  const nodeData = data?.find((item: any)=>{
    return item?.id === taskId;
  });
  const flowID = nodeData?.flowID || nodeData?.flowIDd;
  const pipelineInfo: any = await getPipelineInfo(flowID);
  if (pipelineInfo) {
    const { config, spec: { params, nodes } } = pipelineInfo || {};
    const appID = params?.find((item: any)=>item?.name === 'appID')?.default;
    const tableID = params?.find((item: any)=>item?.name === 'tableID')?.default;

    const curentNode = nodes?.find((item: any)=>item?.name === nodeData?.nodeDefKey);
    const btnObj = {
      hasCancelBtn: false,
      hasResubmitBtn: false,
      hasReadHandleBtn: false,
      hasCcHandleBtn: false,
      hasUrgeBtn: false,
    };
    if (type === 'APPLY_PAGE') {
      btnObj.hasCancelBtn = true;
      btnObj.hasUrgeBtn = true;
    }
    const pipelineFormSchema: any = await getPipelineFormSchemaInfo(appID, tableID);
    const pipelineFormData: any = await getPipelineFormData(
      appID,
      tableID,
      {
        query: {
          term: {
            _id: nodeData?.formDataID,
          },
        },
        ref: buildQueryRef(pipelineFormSchema.schema),
      },

    );
    // const nodeInfo = JSON.parse(curentNode?.spec?.params?.find((item: any)=>item?.key === 'nodeInfo')?.value || null);
    let nodeInfo = null;
    if (nodeData?.nodeDefKey === curentNode?.name) {
      nodeInfo = JSON.parse(nodeData?.nodeInfo || null);
    } else {
      nodeInfo = JSON.parse(curentNode?.spec?.params?.find((item: any)=>item?.key === 'nodeInfo')?.value || null);
    }
    const { fieldPermission, operatorPermission } = nodeInfo?.data?.businessData || {};
    const reaultList = ['agree', 'reject', 'recall'];
    const isFinish = !!reaultList?.includes(nodeData?.result);
    const fillInOperatorPermission = {
      custom: null,
      system: [
        {
          enabled: true,
          changeable: false,
          name: '提交',
          text: '提交',
          value: 'FILL_IN',
          only: 'filIn',
        },
      ],
    };
    const data: any = {
      appId: appID,
      canMsg: config?.canMsg === 1,
      canViewStatusAndMsg: config?.canViewStatusMsg === 1,
      flowName: pipelineInfo?.displayName,
      tableId: tableID,
      formData: pipelineFormData?.entity,
      FormData: pipelineFormData?.entity,
      formSchema: pipelineFormSchema?.schema,
      ...btnObj,
    };
    const taskDetailModelsObj = {
      taskId: taskId,
      taskDefKey: nodeData?.nodeDefKey,
      formData: pipelineFormData?.entity,
      FormData: pipelineFormData?.entity,
      formSchema: pipelineFormSchema?.schema,
      fieldPermission: fieldPermission,
      // operatorPermission: !isFinish && (taskType === 'fillIn' ? fillInOperatorPermission : operatorPermission),
      operatorPermission: (taskType === 'fillIn' ? fillInOperatorPermission : operatorPermission),
      taskType: isFinish ? 'Finish' : 'REVIEW',
      taskName: '',
    };
    data.taskDetailModels = [taskDetailModelsObj];
    return data;
  }
};

class ApprovalsDetailStore {
  @observable taskIdInited = false;
  @observable title = '';
  @observable taskId = '';
  @observable taskDetails: TaskDetail[] = [];
  @observable canViewStatusAndMsg = false;
  @observable canMsg = false;
  @observable formValues = {};
  @observable isRefresh = false;

  @action init = (title: string): void => {
    this.title = title;
  };

  @action initForm = async (
    index: number, processInstanceId: string, type: string, taskId?: string, taskType?: string,
  ): Promise<boolean> => {
    try {
      const resp = await formatPipelineDetail(processInstanceId, { type, taskId, taskType });

      const {
        flowName,
        canMsg,
        canViewStatusAndMsg,
        taskDetailModels,
      } = resp as unknown as FlowInstanceFormResponse;
      let taskDetails: TaskDetail[] = taskDetailModels?.map((model) => {
        if (!this.taskIdInited && model.taskId && model.taskName) {
          this.taskIdInited = true;
          this.taskId = model.taskId;
        }
        if (model.formSchema?.properties || taskDetailModels.length === 1) {
          const formData = model?.formData;
          return {
            formSchema: model.formSchema,
            formData,
            ...mapTaskDetail(model),
          };
        }
        return {
          formSchema: model?.formSchema,
          formData: model?.formData,
          taskId: model.taskId,
          taskName: model.taskName || '详情',
        };
      });
      if (!this.taskIdInited && taskDetails[0]?.taskId) {
        this.taskIdInited = true;
        this.taskId = taskDetails[0]?.taskId;
      }
      const details = this.taskDetails;
      if (details.length) {
        details[index] = taskDetails.find((task) => !!task?.formSchema?.properties) ||
          taskDetails[index];
        taskDetails = details;
      }
      this.title = flowName;
      this.canMsg = canMsg;
      this.canViewStatusAndMsg = canViewStatusAndMsg;
      this.taskDetails = taskDetails;
      return true;
    } catch (e) {
      toast.error(e);
    }
    return false;
  };

  @action clear = (): void => {
    this.taskIdInited = false;
    this.title = '';
    this.taskId = '';
    this.taskDetails = [];
    this.canViewStatusAndMsg = false;
    this.canMsg = false;
  };
}

const formatProperties = (data: any, fieldPermission?: any)=>{
  for (const key in data) {
    if (data[key].type === 'object') {
      formatProperties(data[key].properties);
    } else {
      data[key]?.description && (data[key].description = '');
      try {
        if (fieldPermission) {
          if (isNumber(fieldPermission[key])) {
            data[key]['x-internal'].permission = fieldPermission[key];
          } else {
            data[key]['x-internal'].permission = fieldPermission[key]?.['x-internal']?.permission;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const formatFormSchema = (formSchema: any, fieldPermission?: any)=>{
  formSchema && formatProperties(formSchema.properties, fieldPermission);
  return formSchema;
};
export default new ApprovalsDetailStore();
