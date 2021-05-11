import { observable, action, reaction, IReactionDisposer } from 'mobx';

import toast from '@lib/toast';
import {
  fetchAppList, updateAppStatus, delApp, createdApp,
} from '@portal/modules/apps-management/lib/api';

export type Params = {
  useStatus?: number;
  appName?: string;
}

class AppListStore {
  searchChange: IReactionDisposer
  constructor() {
    this.searchChange = reaction(() => this.params, this.fetchAppList);
  }

  @observable appList: AppInfo[] = [];
  @observable allAppList: AppInfo[] = [];
  @observable params: Params = { useStatus: 0, appName: '' };
  @observable isListLoading = false;

  @action
  delApp = (_id: string) => {
    return delApp(_id).then(() => {
      this.appList = this.appList.filter(({ id }) => id !== _id);
      this.allAppList = this.allAppList.filter(({ id }) => id !== _id);
      toast.success('删除成功！');
    });
  }

  @action
  updateAppStatus = (id: string, useStatus: number) => {
    return updateAppStatus({ id, useStatus }).then(() => {
      this.appList = this.appList.map((appInfo: AppInfo) => {
        if (appInfo.id === id) {
          return { ...appInfo, useStatus };
        }
        return appInfo;
      });
      this.allAppList = this.allAppList.map((appInfo: AppInfo) => {
        if (appInfo.id === id) {
          return { ...appInfo, useStatus };
        }
        return appInfo;
      });
      toast.success(useStatus > 0 ? '发布成功！' : '下架成功');
    });
  }

  @action
  fetchAppList = (params = {}) => {
    this.isListLoading = true;
    return fetchAppList(params).then((res) => {
      this.appList = res.data?.data || [];
      if (JSON.stringify(params) === '{}') {
        this.allAppList = this.appList;
      }
      this.isListLoading = false;
    }).catch(() => {
      this.isListLoading = false;
    });
  }

  @action
  changeParams = (newParams: Params) => {
    this.params = { ...this.params, ...newParams };
  }

  @action
  createdApp = (appInfo: AppInfo) => {
    return createdApp(appInfo).then((res) => {
      const newApp = { ...appInfo, ...res.data };
      this.appList = [newApp, ...this.appList];
      this.allAppList = [newApp, ...this.allAppList];
      return newApp.id;
    });
  }

  @action
  updateApp = (appInfo: AppInfo) => {
    this.allAppList = this.allAppList.map((appItem: AppInfo) => {
      if (appItem.id === appInfo.id) {
        return appInfo;
      }
      return appItem;
    });
  }
}

export default new AppListStore();
