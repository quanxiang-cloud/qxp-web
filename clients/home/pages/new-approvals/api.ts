/* eslint-disable max-len */
// flow instance apis
import httpClient from '@lib/http-client';

// 分页查询我的待处理任务 (审批)
export const getWaitReviewList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/waitReviewList', params);
};

// 分页查询我已处理的任务
export const getMyReviewedList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/reviewedList', params);
};

// 分页查询我申请的流程 (审批)
export const getMyApplyList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  // return await httpClient('/api/v1/flow/instance/myApplyList', params);
  return await httpClient('/api/v1/examine/getByCreated', {
    page: 1,
    limit: 10,
  });
};

// 分页查询我申请的填写流程
export const getMyApplyFillInList = async (type: string, params: Record<string, any>): Promise<any> => {
  return await httpClient(`/api/v1/flow/fill/list/${type}`, params);
};

// 分页查询我申请的填写流程
export const getMobileMyApplyFillInList = async (params: any, type: string): Promise<any> => {
  return await httpClient(`/api/v1/flow/fill/list/${type}`, params);
};

// 获取待填写的总数
export const getTodoFillInCount = async (params: Record<string, any>): Promise<any> => {
  return await httpClient('/api/v1/flow/fill/pending/count', params);
};

// 获取填写节点详情
export const getFillInDetail = async (type: string, taskID: string, params: Record<string, any>): Promise<any> => {
  return await httpClient(`/api/v1/flow/fill/${type}/${taskID}`, params);
};

// 分页查询抄送给我的流程
export const getCCToMeList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/ccToMeList', params);
};

// 分页查询全部流程
export const getAllTaskList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/flow/instance/allList', params);
};

// 获取流程实例数量
export const getFlowInstanceCount = async (params: Record<string, any>): Promise<{ overTimeCount?: number, urgeCount?: number, waitHandleCount?: number, ccToMeCount?: number }> => {
  return await httpClient('/api/v1/flow/instance/getFlowInstanceCount', params);
};

// 获取审批待办实例数量
export const getFlowInstanceApproveCount = async (params: Record<string, any>): Promise<{ overTimeCount?: number, urgeCount?: number, waitHandleCount?: number, ccToMeCount?: number }> => {
  return await httpClient('/api/v1/flow/instance/getFlowInstanceCount', params);
};
// 获取填写待办实例数量
export const getFlowInstanceFillInCount = async (params: Record<string, any>): Promise<{ overTimeCount?: number, urgeCount?: number, waitHandleCount?: number, ccToMeCount?: number }> => {
  return await httpClient('/api/v1/flow/instance/getFlowInstanceCount', params);
};

// 获取阻塞的流程列表
export const getBlockList = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/getBlockList', params);
};

// 获取任务的表单权限
export const getTaskFormPermission = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/getTaskFormPermission/{processInstanceId}/{taskId}', params);
};

// 阅示
export const readFlow = async (processInstanceId: string, taskId: string, params: Record<string, any>): Promise<{ data: any }> => {
  return await httpClient(`/api/v1/flow/instance/readFlow/${processInstanceId}/${taskId}`, params);
};

// 催办
export const taskUrge = async (processInstanceID: string): Promise<void> => {
  return await httpClient('/api/v1/flow/urge/taskUrge', { processInstanceID });
};

// 抄送
export const ccFLow = async (processInstanceId: string, taskId: string, params: Record<string, any>) => {
  return await httpClient(`/api/v1/flow/instance/ccFlow/${processInstanceId}/${taskId}`, params);
};

// 启动流程
export const startFLow = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/startFlow', params);
};

// 抄送/阅示处理
export const handleRelatedFlow = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/handleCorrelationFlow/{id}', params);
};

// 处理阅示
export const handleRead = async (processInstanceId: string, taskId: string, params: Record<string, any>) => {
  return await httpClient(`/api/v1/flow/instance/handleRead/${processInstanceId}/${taskId}`, params);
};

// 启动单个流程
export const startFlowById = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/startFlow/{flowId}', params);
};

// 退回某步
export const stepBack = async (processInstanceId: string, taskId: string, params: Record<string, any>) => {
  return await httpClient(`/api/v1/flow/instance/stepBack/${processInstanceId}/${taskId}`, params);
};

// 任务审核（通过任务）
export const reviewTask = async (processInstanceId: string, taskId: string, params: { handleType: string; remark: any, [key: string]: any }): Promise<{ data: any }> => {
  return await httpClient(`/api/v1/flow/instance/reviewTask/${processInstanceId}/${taskId}`, params);
};

// 提交填写
export const submitFillTask = async ( params: { id: string; formData: any, [key: string]: any }): Promise<{ data: any }> => {
  return await httpClient('/api/v1/flow/fill/', params);
};
// 加签
export const signTask = async (processInstanceId: string, taskID: string, params: Record<string, any>) => {
  return await httpClient(`/api/v1/flow/instance/addSign/${processInstanceId}/${taskID}`, params);
};

// // 获取任务的表单
// export const getTaskFormById = async (processInstanceID: string, taskID: string): Promise<TaskForm> => {
//   return await httpClient(`/api/v1/flow/instance/getTaskForm/${processInstanceID}/${taskID}`);
// };

// 获取任务的表单
export const getTaskFormById = async (processInstanceID: string,
  params: { type: string, taskId?: string }): Promise<TaskForm> => {
  return await httpClient(`/api/v1/flow/instance/getFlowInstanceForm/${processInstanceID}`, params);
};

// 流程任务审核
export const reviewFlowTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/reviewFlowTask/{processInstanceId}/{taskId}', params);
};

// 委托任务
export const entrustTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/entrustTask/{processInstanceId}/{taskId}', params);
};

// 领取任务
export const claimTask = async (params: Record<string, any>) => {
  return await httpClient('/api/v1/flow/instance/claimTask/{processInstanceId}/{taskId}', params);
};

// 打回重填
export const sendBack = async (processInstanceID: string, taskID: string, params: { handleType: string; remark: any }): Promise<{ data: any }> => {
  return await httpClient(`/api/v1/flow/instance/sendBack/${processInstanceID}/${taskID}`, params);
};

// 全部已读
export const readAll = async (params: string[]) => {
  return await httpClient('/api/v1/flow/instance/handleCc', params);
};

// 撤销
export const cancelTask = async (processInstanceId: string) => {
  return await httpClient(`/api/v1/flow/instance/cancel/${processInstanceId}`);
};

// 转交
export const deliverTask = async (processInstanceId: string, taskId: string, params: { handleType: string, remark: any, [key: string]: any }) => {
  return await httpClient(`/api/v1/flow/instance/deliverTask/${processInstanceId}/${taskId}`, params);
};

// 获取可回退的节点列表
export const getStepbackActivityList = async (processInstanceId: string): Promise<any> => {
  return await httpClient(`/api/v1/flow/instance/stepBackActivityList/${processInstanceId}`);
};

// 处理阅示
export const handleReadTask = async (
  processInstanceId: string,
  taskId: string,
  remark?: string,
): Promise<{ data: any }> => {
  return await httpClient(`/api/v1/flow/instance/handleRead/${processInstanceId}/${taskId}`, { remark });
};

// 获取流程处理记录
export const getProcessHistories = async (processInstanceID: string): Promise<any> => {
  return await httpClient(`/api/v1/flow/instance/processHistories/${processInstanceID}`);
};

// 获取评论列表
export const getComments = async (processInstanceId: string, taskId: string): Promise<any> => {
  return await httpClient(`/api/v1/flow/comment/getComments/${processInstanceId}/${taskId}`);
};

// 新增评论
export const addComment = async (params: any): Promise<any> => {
  return await httpClient('/api/v1/flow/comment/addComment', params);
};

// 重新提交
export const resubmit = async (processInstanceId: string, formData?: Record<string, any>): Promise<any> => {
  return await httpClient(`/api/v1/flow/instance/resubmit/${processInstanceId}`, { formData });
};

// pipeline 获取待审批的总数
export const getPipelineTodoApprovalCount = async (): Promise<any> => {
  return await httpClient('/api/v1/examine/getByUserID', { nodeResult: 'Pending', page: 1, limit: 0 });
};

// pipeline 获取待填写的总数
export const getPipelineTodoFillInCount = async (): Promise<any> => {
  return await httpClient('/api/v1/fill/list', { nodeResult: 'Pending', page: 1, limit: 0 });
};

// 分页查询我的待处理任务 (审批)
export const getPipelineWaitReviewList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  const { page, size } = params;
  return await httpClient('/api/v1/examine/getByUserID', {
    page,
    limit: size,
    nodeResult: 'Pending',
  });
};

// 获取节点详情
export const getPipelineWaitReviewInfo = async (taskID: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/examine/getByTaskID', {
    taskID,
  });
};

// 获取流程信息
export const getPipelineInfo = async (flowID: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  // return await httpClient.get(`/api/v1/pipelinerun/${taskID}`);
  return await httpClient.get(`/api/v1/pipeline/${flowID}`);
};

// 获取审批列表表单信息
export const getPipelineFormInfo = async (params: any): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/examine/get', params);
};

// 获取填写列表表单信息
export const getPipelineFillInFormInfo = async (params: any): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/fill/getByRunID', { runID: params?.id });
};

// 获取审批列表表单Schema信息
export const getPipelineFormSchemaInfo = async (appID: Record<string, any>, tableID: any): Promise<{ dataList: any, total: number }> => {
  return await httpClient(`/api/v1/form/${appID}/home/schema/${tableID}`, { tableID });
};

// 批量查询应用信息
export const getPipelineAppInfo = async (ids: any): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/app-center/apps', { ids });
};

// 批量查询用户信息
export const getPipelineUserInfo = async (IDs: any): Promise<{ dataList: any, total: number }> => {
  return httpClient('/api/v1/org/h/user/ids', { IDs } );
};

// 获取流程处理记录
export const getPipelineProcessHistories = async (taskID: string): Promise<any> => {
  return await httpClient('/api/v1/examine/getByTaskID', { taskID });
};

// 获取流程执行信息
export const getPipelineRunInfo = async (id: string): Promise<any> => {
  return await httpClient.get(`/api/v1/pipelineRun/${id}`);
};

// 同意
export const pipelineAgree = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/agree', data);
};

// 拒绝
export const pipelineReject = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/reject', data);
};

// 撤回
export const pipelineRecall = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/recall', { taskID: data });
};

// 催办
export const pipelineUrge = async (data: any): Promise<any> => {
  return await httpClient('/api/v1/examine/urge', { taskID: data });
};

// 分页查询我的待处理任务 (填写)
export const getPipelineTodoFillInList = async (params: any): Promise<any> => {
  const { page, size } = params;
  return await httpClient('/api/v1/fill/list', {
    page,
    limit: size,
    nodeResult: 'Pending',
  });
};

// 分页查询我已处理的任务(审批)
export const getPipelineMyReviewedList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  const { page, size } = params;
  return await httpClient('/api/v1/examine/getByUserID', {
    page,
    limit: size,
    nodeResult: 'Finish',
  });
};

// 分页查询我已处理的任务(填写)
export const getPipelineMyReviewedFillInList = async (params: Record<string, any>): Promise<any> => {
  const { page, size } = params;
  return await httpClient('/api/v1/fill/list', {
    page,
    limit: size,
    nodeResult: 'Finish',
  });
};

// 分页查询我申请的流程 (审批)
export const getMyApplyPipelineList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  return await httpClient('/api/v1/examine/getByCreated', params);
};

// 分页查询我申请的流程 (填写)
export const getMyApplyPipelineFillInList = async (params: Record<string, any>): Promise<any> => {
  return await httpClient('/api/v1/fill/getByCreated', params);
};

// 分页查询全部任务(审批)
export const getPipelineAllList = async (params: Record<string, any>): Promise<{ dataList: any, total: number }> => {
  const { page, size } = params;
  return await httpClient('/api/v1/examine/allList ', {
    page,
    limit: size,
  });
};

// 分页查询全部任务(填写)
export const getPipelineAllFillInList = async (params: Record<string, any>): Promise<any> => {
  const { page, size } = params;
  return await httpClient('/api/v1/fill/all', {
    page,
    limit: size,
  });
};

// 获取填写节点详情
export const getPipelineFillInDetail = async (id: string): Promise<any> => {
  return await httpClient('/api/v1/fill/one', { id });
};

// 提交填写
export const submitPipelineFillTask = async ( params: { id: string; forMData: any, [key: string]: any }): Promise<{ data: any }> => {
  return await httpClient('/api/v1/fill/fill', params);
};

export const getPipelineFormData = async (appID: any, tableID: any, params: Record<string, any>): Promise<any> => {
  return await httpClient(`/api/v1/form/${appID}/home/form/${tableID}/get`, params);
};

// 获取审批动态 taskID
export const getPipelineApproveProcessInfo = (runID: string) => {
  return httpClient<any>('/api/v1/examine/getByTaskID', { taskID: runID });
};

// 获取填写动态 taskID
export const getPipelineFillInProcessInfo = (runID: string) => {
  return httpClient<any>('/api/v1/fill/getByRunID', { runID });
};

export const getAllProcessInfo = (runID: string)=>{
  const arr: any = [getPipelineApproveProcessInfo, getPipelineFillInProcessInfo];
  return Promise.all(arr.map((item: any)=>item(runID)));
};
