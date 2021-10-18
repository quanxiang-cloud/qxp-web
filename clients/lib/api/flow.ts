import httpClient, { FormDataRequestUpdateParamsRef } from '@lib/http-client';

export const getFlowFormData = (
  processInstanceID: string,
  taskID: string,
  ref?: FormDataRequestUpdateParamsRef,
): Promise<TaskForm> => {
  return httpClient(`/api/v1/flow/instance/getFormData/${processInstanceID}/${taskID}`, { ref });
};
