import { observable, action, reaction, IReactionDisposer, computed } from 'mobx';

import toast from '@lib/toast';

import { updateAppStatus, createPage } from '../../app-details/api';
import { fetchAppList, delApp, createdApp } from './api';

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

  @computed get countMaps() {
    let published = 0;
    let unPublished = 0;
    this.allAppList.forEach((app: AppInfo) => {
      if (app.useStatus > 0) {
        published += 1;
      } else {
        unPublished += 1;
      }
    });

    return {
      all: this.allAppList.length,
      published,
      unPublished,
    };
  }

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
  fetchAppList = (params: Params) => {
    this.isListLoading = true;
    return fetchAppList(params).then((res) => {
      this.appList = res.data?.data || [];
      if (params.useStatus === 0 && params.appName === '') {
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
      createPage({
        describe: '补充说明信息。',
        icon: 'event_available',
        name: '示例页面',
        appID: res.data.id, id: '',
      });
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
