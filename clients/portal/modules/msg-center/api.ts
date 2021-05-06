import fetcher from '@lib/fetcher';
import { QueryFunctionContext } from 'react-query';
import { omitEmpty } from '@portal/utils';

// 获取未读消息列表
export const getMessageList = async ({ queryKey }: QueryFunctionContext) => {
  // const defaults = {
  //   read_status: MsgReadStatus.unread,
  //   page: 1,
  // };
  const { data } = await fetcher.post('/api/v1/message/center/getList', omitEmpty(queryKey[1]));
  return data;
};

// 获取未读消息个数
export const getUnreadMsgCount = async () => {
  const { data } = await fetcher.post('/api/v1/message/center/getNumer'); // fixme: typo?
  return data;
};

// 根据id查询消息详情
export const getMsgById = async ({ queryKey }: QueryFunctionContext) => {
  // const [, params] = queryKey;
  const defaults = {
    read: false, // 是否标记为已读
  };
  const { data } = await fetcher.post('/api/v1/message/center/getById',
    Object.assign(defaults, queryKey[1])
  );
  return data;
};

// 把当前登录人，所有的消息标记为已读
export const setAllMsgAdRead=async ()=> {
  const { data }=await fetcher.post('/api/v1/message/center/allRead');
  return data;
};

// 根据ids 删除消息，包括单条消息
export const deleteMsgByIds=async (ids: string[])=> {
  const { data }=await fetcher.post('/api/v1/message/center/deleteByIds', { arr_id: ids });
  return data;
};

// 根据ids 把消息标记为已读
export const setMsgAsReadByIds=async (ids: string[])=> {
  const { data }=await fetcher.post('/api/v1/message/center/readByIds', { arr_id: ids });
  return data;
};
