import { action, observable } from 'mobx';
import { get } from 'lodash';

import { formatRelativeTime } from '@m/lib/formatter';
import toast from '@lib/toast';
import { getMessageList, getUnreadMsgCount, setAllMsgAdRead } from '@portal/modules/msg-center/api';
import msgCenter from '@portal/stores/msg-center';
import { Message } from '../types';

import { MessageRequest, MessageTabKeys } from './constant';

const limit = 20;
const request = getMessageList as MessageRequest;

let lastLoad = 0;

class MessagesStore {
  private readonly types: number;

  constructor(types: number) {
    this.types = types;
  }

  @observable list: Message[] = [];
  @observable page = 0;
  @observable finished = false;
  @observable inited = false;
  @observable unread = 0;

  @action
  loadMessages = async (pageKey: number, loadUnread = true): Promise<void> => {
    const params: Record<string, any> = { page: pageKey, limit };
    if (this.types > -1) {
      params.types = this.types;
    }
    if (pageKey < 2 && loadUnread) this.loadUnreadCount();
    try {
      const res = await request({ queryKey: ['', params], pageParam: undefined, meta: undefined });
      let data = res?.list;
      if (data && data.length > 0) {
        data = data.map((message) => {
          return {
            ...message,
            updated: formatRelativeTime(message.updatedAt ?? message.createdAt ?? 0),
          };
        });
      } else {
        data = [];
      }
      this.page = pageKey;
      this.finished = data.length < limit;

      if (pageKey < 2) {
        this.list = data;
      } else {
        this.list = this.list.concat(data);
      }
    } catch (e) {
      if (!this.inited) this.inited = true;
      toast.error(e);
      throw e;
    }
    if (!this.inited) this.inited = true;
  };

  @action
  loadUnreadCount = (): void => {
    if (new Date().valueOf() - lastLoad < 500) return;
    lastLoad = new Date().valueOf();
    getUnreadMsgCount().then((data) => {
      msgCenter.setUnreadTypeCounts(get(data, 'typeNum', []));
    });
  };

  @action
  read = (message: Message, index: number): void => {
    if (message.readStatus === 1) {
      const _message = { ...message, readStatus: 2 };
      this.list = this.list.splice(index, 1, _message);
    }
  };

  @action
  readAll = async (): Promise<boolean> => {
    return setAllMsgAdRead().then(() => {
      msgCenter.setUnreadTypeCounts([]);
      toast.success('已将全部消息标记为已读');
      this.loadMessages(1, false);
      return true;
    }).catch((e) => {
      toast.error(e);
      return false;
    });
  };

  @action
  clear = (): void => {
    this.list = [];
    this.page = 0;
    this.finished = false;
    this.inited = false;
    this.unread = 0;
  };
}

const allStore = new MessagesStore(-1);
const noticeStore = new MessagesStore(2);
const systemStore = new MessagesStore(1);

export const store: Record<MessageTabKeys, MessagesStore> = {
  all: allStore,
  notice: noticeStore,
  system: systemStore,
};
