import httpClient from '@lib/http-client';
import { MsgReadStatus, MsgType } from '@portal/modules/system-mgmt/constants';

type QueryFilter={
  status?: MsgReadStatus | number;
  // sort?: MsgType;
  types?: MsgType;
  page: number;
  limit: number;
  // key_word?: string
  key?: string
}

type LogQueryFilter = {
  userName?: string;
  operationTimeBegin?: number;
  operationTimeEnd?: number;
  page?: number;
  size?: number;
}

export function createMsg(msgData: Qxp.CreateMsgData) {
  return httpClient('/api/v1/message/manager/create', msgData);
}

// 根据id删除消息
export const deleteMsgById = async (id: string)=> {
  // todo fix any type
  return await httpClient<any>('/api/v1/message/manager/delete', { id });
};

// 获取消息详情
export const getMsgById = async (id: string): Promise<Qxp.NewMsgData>=> {
  return await httpClient('/api/v1/message/manager/getMesByID', { id });
};

// 带条件查询消息列表
export const getMsgList = async (filter: QueryFilter)=> {
  // todo fix any type
  return await httpClient<any>('/api/v1/message/manager/getMesList', filter);
};

// 查询审计日志列表
export const getLogList = async (filter: LogQueryFilter)=> {
  return await httpClient<any>('/api/v1/audit/search', filter);
};
