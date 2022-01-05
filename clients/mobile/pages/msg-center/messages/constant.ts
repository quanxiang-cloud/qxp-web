import { QueryFunctionContext } from 'react-query';

import { Props } from '@m/qxp-ui-mobile';
import { EmptyProps } from '@m/qxp-ui-mobile/empty';
import { Message } from '../types';

export type MessageTabKeys = 'all' | 'notice' | 'system';

export interface MessageMessageTabTitle {
  key: MessageTabKeys;
  label: string;
}

export const allMessages: MessageMessageTabTitle[] = [
  { key: 'all', label: '全部' },
  { key: 'notice', label: '通知公告' },
  { key: 'system', label: '系统消息' },
];

export interface MessagesResponse {
  list: Message[]
}

export type MessageRequest = (
  params: QueryFunctionContext<[string, Record<string, any>]>
) => Promise<MessagesResponse>;

export interface MessageTabProps extends Props {
  empty: EmptyProps;
  type: MessageTabKeys;
}

export const MessageEmpty = {
  content: '暂无消息',
  image: '/dist/images/message_empty_tips.svg',
};

export const allTabs: Record<MessageTabKeys, MessageTabProps> = {
  all: {
    empty: MessageEmpty,
    type: 'all',
  },
  notice: {
    empty: MessageEmpty,
    type: 'notice',
  },
  system: {
    empty: MessageEmpty,
    type: 'system',
  },
};
