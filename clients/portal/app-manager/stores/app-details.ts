import { observable, action } from 'mobx';
import { Message } from '@QCFE/lego-ui';

import { fetchAppDetails, updateAppStatus, updateApp } from '@appLib/api';

class AppDetailsStore {
  @observable appDetails: any = {};

  @observable loading = false;

  @observable visibleAppManager = false;

  @action
  setVisibleAppManager = (visible: boolean) => {
    this.visibleAppManager = visible;
  }

  @action
  updateAppStatus = () => {
    const { id, useStatus } = this.appDetails;
    return updateAppStatus({ id, useStatus: -1 * useStatus }).then(() => {
      this.appDetails.useStatus = -1 * useStatus;
      Message.success({ content: useStatus < 0 ? '发布成功！' : '下架成功' });
    });
  }

  @action
  fetchAppDetails = (appId: string) => {
    this.loading = true;
    return fetchAppDetails(appId).then((res) => {
      this.appDetails = res;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  @action
  updateApp = (appInfo: any) => {
    return updateApp({ id: this.appDetails.id, ...appInfo }).then(() => {
      this.appDetails = { ...this.appDetails, ...appInfo };
      Message.success({ content: '修改成功！' });
    });
  }
}

export default AppDetailsStore;
