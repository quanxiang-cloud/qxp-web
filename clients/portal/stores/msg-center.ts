// message center store
import { observable, action, computed } from 'mobx';
import { find, get } from 'lodash';
import { MsgType } from '@portal/modules/system-mgmt/constants';

class MsgCenter {
  @observable.shallow
  countUnreadByType = [
    // {total: 0, sort: 1}
  ];

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
  curMsgId='';

  @computed
  get countUnread() {
    return this.countUnreadSystemMsg + this.countUnreadNotifyMsg;
  }

  @computed
  get countUnreadSystemMsg() {
    return get(find(this.countUnreadByType, { sort: MsgType.system }), 'total', 0);
  }

  @computed
  get countUnreadNotifyMsg() {
    return get(find(this.countUnreadByType, { sort: MsgType.notify }), 'total', 0);
  }

  @computed
  get filterCheckUnread() {
    return this.filters.get('unread');
  }

  @action
  openUnreadMsgBox = (open = true) => {
    this.msgBoxOpen = open;
  }

  @action
  openMsgCenter = (open = true) => {
    this.msgCenterOpen = open;
  }

  @action
  setFilter = (key: string, val: any) => {
    this.filters.set(key, val);
  }

  @action
  setUnreadFilter = (unread: boolean) => {
    this.setFilter('unread', unread);
    this.paging = {
      limit: 10,
      page: 1,
    };
  }

  @action
  setUnreadTypeCounts = (counts: Array<Qxp.MsgTypeCount>) => {
    // @ts-ignore
    this.countUnreadByType = counts;
  }

  @action
  changeType = (type: MsgType) => {
    this.selectType = type;
    this.messageDetail = null;
  }

  @action
  setPaging = (params: Partial<{ limit: number, page: number }>) => {
    Object.assign(this.paging, params);
  }

  @action
  setLoadingDetail=(loading: boolean)=> {
    this.loadingDetail = loading;
  }

  @action
  setDetail = (msg: any) => {
    this.messageDetail = msg;
  }

  @action
  setCurMsgId = (id: string) => {
    this.curMsgId = id;
  }

  @action
  reset = () => {
    this.curMsgId = '';
    this.messageDetail = null;
  }
}

export default new MsgCenter();
