import httpClient from '@lib/http-client';
// import {QueryFunctionContext} from 'react-query';
import { omitEmpty } from '@portal/utils';

// 获取未读消息列表
export const getMessageList = async ({ queryKey }: QueryFuncCtx) => {
  const [, params] = queryKey;
  // const defaults = {
  //   read_status: MsgReadStatus.unread,
  //   page: 1,
  // };
  return await httpClient('/api/v1/message/center/getList', omitEmpty(params));
};

// 获取未读消息个数
export const getUnreadMsgCount = async () => {
  return await httpClient('/api/v1/message/center/getNumer'); // fixme: typo?;
};

// 根据id查询消息详情
export const getMsgById = async ({ queryKey }: QueryFuncCtx) => {
  const [, params] = queryKey;
  const defaults = {
    read: false, // 是否标记为已读
  };
  return await httpClient('/api/v1/message/center/getById', { ...defaults, ...params });
};

// 把当前登录人，所有的消息标记为已读
export const setAllMsgAdRead=async ()=> {
  return await httpClient('/api/v1/message/center/allRead');
};

// 根据ids 删除消息，包括单条消息
export const deleteMsgByIds=async (ids: string[])=> {
  return await httpClient('/api/v1/message/center/deleteByIds', { arr_id: ids });
};

// 根据ids 把消息标记为已读
export const setMsgAsReadByIds=async (ids: string[])=> {
  return await httpClient('/api/v1/message/center/readByIds', { arr_id: ids });
};
