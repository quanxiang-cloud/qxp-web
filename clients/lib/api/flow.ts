import httpClient from '@lib/http-client';
import { FormDataRequestUpdateParamsRef } from '@lib/http-client-form';

export const getFlowFormData = (
  processInstanceID: string,
  taskID: string,
  ref?: FormDataRequestUpdateParamsRef,
): Promise<TaskForm> => {
  return httpClient(`/api/v1/flow/instance/getFormData/${processInstanceID}/${taskID}`, { ref });
};
