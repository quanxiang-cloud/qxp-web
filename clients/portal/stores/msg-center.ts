// message center store
import { observable, action, computed } from 'mobx';
import { find, get } from 'lodash';
import { MsgType } from '@portal/const/message';
import { getMessageDetail } from '@lib/requests/message-center';

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
  loadingOfGetDetail = false;

  @observable
  messageDetail = null;

  @observable
  unReadCount = {
    announcement: 0,
    systemMessage: 0,
  }

  @computed
  get countUnread() {
    const counts = this.countUnreadByType.slice();
    const countSystem = get(find(counts, { sort: MsgType.system }), 'total', 0);
    const countNotify = get(find(counts, { sort: MsgType.notify }), 'total', 0);
    return countSystem + countNotify;
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
  setUnreadFilter=(unread: boolean)=> {
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
  pageChange = (pageNumber: number, pageSize: number) => {
    this.paging = {
      limit: pageSize,
      page: pageNumber,
    };
  }

  @action
  showMessageDetail(id: string) {
    this.loadingOfGetDetail = true;
    getMessageDetail(id)
      .then((response)=>{
        this.loadingOfGetDetail = false;
        if (response.code==0) {
          this.messageDetail = response.data;
        }
      });
  }

  @action
  setUnReadCount(resetValue: any) {
    this.unReadCount = resetValue;
  }
}

export default new MsgCenter();
