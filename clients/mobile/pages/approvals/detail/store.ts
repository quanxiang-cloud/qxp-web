import { action, observable } from 'mobx';

import { FlowInstanceFormResponse, TaskDetail } from '../types';
import { getTaskFormById } from '@home/pages/approvals/api';
import { getRequestFormData } from '@m/lib/value-render';
import { getFlowFormData } from '@lib/api/flow';
import toast from '@lib/toast';

import { mapTaskDetail } from './utils';

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
    index: number, processInstanceId: string, type: string, taskId?: string,
  ): Promise<boolean> => {
    try {
      const resp = await getTaskFormById(processInstanceId, { type, taskId });
      const {
        flowName,
        canMsg,
        canViewStatusAndMsg,
        taskDetailModels,
      } = resp as unknown as FlowInstanceFormResponse;
      for (let i = 0; i < taskDetailModels?.length || 0; i += 1) {
        const model = taskDetailModels[i];
        if (model.formSchema && Object.keys(model.formSchema)?.length) {
          const data = getRequestFormData(model.formSchema?.properties || {});
          model.formData = await getFlowFormData(processInstanceId, model.taskId || taskId || '', data);
        }
      }
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

export default new ApprovalsDetailStore();
