import { observable, action, computed } from 'mobx';
import { Message } from '@QCFE/lego-ui';

import { fetchAppDetails, updateAppStatus } from '@appLib/api';

class AppDetailsStore {
  constructor(rootStore) {

  }

  @observable appDetails: any = {};

  @observable visibleAppManager = false;

  @action
  setVisibleAppManager = (visible:boolean) => {
    this.visibleAppManager = visible;
  }

  @action
  updateAppStatus = ()=>{
    const { id, useStatus } = this.appDetails;
    return updateAppStatus({ id, useStatus: -1 * useStatus }).then(()=>{
      this.appDetails.useStatus = -1 * useStatus;
      Message.success({ content: useStatus < 0 ? '发布成功！' : '下架成功' });
    });
  }

  @action
  fetchAppDetails = (appId: string) => {
    return fetchAppDetails(appId).then((res) => {
      this.appDetails = res;
    });
  }
}

export default AppDetailsStore;
