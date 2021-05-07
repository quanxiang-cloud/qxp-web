import httpClient from '@lib/http-client';
import { QueryFunctionContext } from 'react-query';
import { omitEmpty } from '@portal/utils';

// 获取未读消息列表
export async function getMessageList(
  { queryKey }: QueryFunctionContext<[string, Record<string, any>]>
): Promise<Record<string, any>> {
  // const defaults = {
  //   read_status: MsgReadStatus.unread,
  //   page: 1,
  // };
  return await httpClient('/api/v1/message/center/getList', omitEmpty(queryKey[1]));
}

// 获取未读消息个数
export async function getUnreadMsgCount() {
  return await httpClient('/api/v1/message/center/getNumer'); // fixme: typo?
}

// 根据id查询消息详情
export async function getMsgById({ queryKey }: QueryFunctionContext) {
  // const [, params] = queryKey;
  const defaults = {
    read: false, // 是否标记为已读
  };
  return await httpClient('/api/v1/message/center/getById',
    Object.assign(defaults, queryKey[1])
  );
}

// 把当前登录人，所有的消息标记为已读
export async function setAllMsgAdRead() {
  return await httpClient('/api/v1/message/center/allRead');
}

// 根据ids 删除消息，包括单条消息
export async function deleteMsgByIds(ids: string[]) {
  return await httpClient('/api/v1/message/center/deleteByIds', { arr_id: ids });
}

// 根据ids 把消息标记为已读
export async function setMsgAsReadByIds(ids: string[]) {
  return await httpClient('/api/v1/message/center/readByIds', { arr_id: ids });
}
