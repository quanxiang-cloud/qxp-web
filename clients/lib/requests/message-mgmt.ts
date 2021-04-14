import fetcher from '@lib/fetcher';
import { MsgReadStatus, MsgType } from '@portal/const/message';

type QueryFilter={
  status?: MsgReadStatus | number;
  sort?: MsgType;
  page: number;
  limit: number;
  key_word?: string
}

// 发送消息和在草稿基础上，更新消息
export const createMsg=async (msgData: Qxp.NewMsgData)=> {
  const { data }=await fetcher.post('/api/v1/message/manager/create', msgData);
  return data;
};

// 根据id删除消息
export const deleteMsgById=async (id: string)=> {
  const { data }=await fetcher.post('/api/v1/message/manager/delete', { id });
  return data;
};

// 获取消息详情
export const getMsgById=async (id: string): Promise<Qxp.NewMsgData>=> {
  const { data }=await fetcher.post('/api/v1/message/manager/getMesByID', { id });
  return data;
};

// 带条件查询消息列表
export const getMsgList=async (filter: QueryFilter)=> {
  const { data }=await fetcher.post('/api/v1/message/manager/getMesList', filter);
  return data;
};
