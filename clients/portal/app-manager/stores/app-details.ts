import { observable, action, reaction } from 'mobx';
import { Message } from '@QCFE/lego-ui';

import { fetchAppDetails, updateAppStatus, updateApp } from '@appLib/api';

class AppDetailsStore {
  rootStore: any;
  destroyFetchAppDetails: () => void;
  constructor(rootStore: any) {
    this.rootStore = rootStore;
    this.destroyFetchAppDetails = reaction(() => this.appId, this.fetchAppDetails);
  }

  @observable appDetails: any = {};

  @observable loading = false;

  @observable appId = '';

  @action
  setAppId = (appId: string) => {
    this.appId = appId;
  }

  @action
  updateAppStatus = () => {
    const { id, useStatus } = this.appDetails;
    return updateAppStatus({ id, useStatus: -1 * useStatus }).then(() => {
      this.appDetails.useStatus = -1 * useStatus;
      this.rootStore.appListStore.updateApp(this.appDetails);
      Message.success({ content: useStatus < 0 ? '发布成功！' : '下架成功' });
    });
  }

  @action
  fetchAppDetails = (appId: string) => {
    this.loading = true;
    return fetchAppDetails(appId).then((res) => {
      this.appDetails = res.data || {};
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  @action
  updateApp = (appInfo: any) => {
    return updateApp({ id: this.appDetails.id, ...appInfo }).then(() => {
      this.appDetails = { ...this.appDetails, ...appInfo };
      this.rootStore.appListStore.updateApp(this.appDetails);
      Message.success({ content: '修改成功！' });
    });
  }
}

export default AppDetailsStore;
