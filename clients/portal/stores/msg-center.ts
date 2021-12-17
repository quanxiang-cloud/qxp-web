// message center store
import { observable, action, computed } from 'mobx';
import { find, get } from 'lodash';
import { MsgType } from '@portal/modules/system-mgmt/constants';

class MsgCenter {
  @observable.shallow
  countUnreadByType: Array<Qxp.MsgTypeCount> | undefined;

  @observable msgBoxOpen = false; // nav unread msg box

  @observable msgCenterOpen = false // msg center modal

  @observable.shallow
  paging = {
    limit: 10,
    page: 1,
  }

  @observable.shallow
  filters = new Map([['unread', false]]);

  @observable
  selectType = MsgType.all;

  @observable
  loadingDetail = false;

  @observable
  messageDetail = null;

  @observable
  curMsgId = '';

  @computed
  get countUnread(): any {
    return this.countUnreadSystemMsg + this.countUnreadNotifyMsg;
  }

  @computed
  get countUnreadSystemMsg(): any {
    return get(find(this.countUnreadByType, { types: MsgType.system }), 'total', 0);
  }

  @computed
  get countUnreadNotifyMsg(): any {
    return get(find(this.countUnreadByType, { types: MsgType.notify }), 'total', 0);
  }

  @computed
  get filterCheckUnread(): boolean | undefined {
    return this.filters.get('unread');
  }

  @action
  openUnreadMsgBox = (open = true): void => {
    this.msgBoxOpen = open;
  }

  @action
  openMsgCenter = (open = true): void => {
    this.msgCenterOpen = open;
  }

  @action
  setFilter = (key: string, val: any): void => {
    this.filters.set(key, val);
  }

  @action
  setUnreadFilter = (unread: boolean): void => {
    this.setFilter('unread', unread);
    this.paging = {
      limit: 10,
      page: 1,
    };
  }

  @action
  setUnreadTypeCounts = (counts: Array<Qxp.MsgTypeCount>): void => {
    this.countUnreadByType = counts;
  }

  @action
  changeType = (type: MsgType): void => {
    this.selectType = type;
    this.messageDetail = null;
  }

  @action
  setPaging = (params: Partial<{ limit: number, page: number }>): void => {
    Object.assign(this.paging, params);
  }

  @action
  setLoadingDetail = (loading: boolean): void => {
    this.loadingDetail = loading;
  }

  @action
  setDetail = (msg: any): void => {
    this.messageDetail = msg;
  }

  @action
  setCurMsgId = (id: string): void => {
    this.curMsgId = id;
  }

  @action
  reset = (): void => {
    this.curMsgId = '';
    this.messageDetail = null;
  }
}

export default new MsgCenter();
