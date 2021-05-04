import { observable, action, reaction, IReactionDisposer } from 'mobx';
import { intersection } from 'lodash';

import toast from '@lib/toast';
import { fetchAppList, updateAppStatus, delApp, createdApp } from '@portal/modules/app-management/lib/api';

type Params = {
  status: number;
  keyword: string;
}

function findStatusList(list: AppInfo[], status: number) {
  return list.filter((appInfo) => appInfo.useStatus === status);
}

function findKeyword(list: AppInfo[], appName: string) {
  return list.filter((appInfo) => appInfo.appName.includes(appName));
}

class AppListStore {
  searchChange: IReactionDisposer
  constructor() {
    this.searchChange = reaction(() => this.params, this.setRenderList);
  }

  @observable appList: AppInfo[] = [];

  @observable appRenderList: AppInfo[] = [];

  @observable params: Params = { status: 0, keyword: '' };

  @observable isListLoading = false;

  @action
  delApp = (_id: string) => {
    return delApp(_id).then(() => {
      this.appList = this.appList.filter(({ id }) => id !== _id);
      this.appRenderList = this.appRenderList.filter(({ id }) => id !== _id);
      toast.success('删除成功！');
    });
  }

  @action
  setRenderList = () => {
    const dataList = this.appList;
    const { status, keyword } = this.params;
    const statusList = status === 0 ? dataList : findStatusList(dataList, status);
    const keywordList = keyword === '' ? dataList : findKeyword(dataList, keyword);
    this.appRenderList = intersection(statusList, keywordList);
  }

  @action
  updateAppStatus = (id: string, useStatus: number) => {
    return updateAppStatus({ id, useStatus }).then(() => {
      [{ list: this.appRenderList, key: 'appRenderList' },
        { list: this.appList, key: 'appList' }].map(({ list, key }) => {
        // @ts-ignore
        this[key] = list.map((appInfo: AppInfo) => {
          if (appInfo.id === id) {
            return { ...appInfo, useStatus };
          }
          return appInfo;
        });
      });
      toast.success(useStatus > 0 ? '发布成功！' : '下架成功');
    });
  }

  @action
  fetchAppList = () => {
    this.isListLoading = true;
    return fetchAppList().then((res) => {
      this.appList = res.data.data;
      this.appRenderList = res.data.data;
      this.isListLoading = false;
    }).catch(() => {
      this.isListLoading = false;
    });
  }

  @action
  changeParams = (newParams: any) => {
    this.params = { ...this.params, ...newParams };
  }

  @action
  createdApp = (appInfo: AppInfo) => {
    debugger;
    return createdApp(appInfo).then((res) => {
      const newApp = { ...appInfo, ...res.data };
      this.appList = [newApp, ...this.appList];
      this.appRenderList = [newApp, ...this.appRenderList];
      return newApp.id;
    });
  }

  @action
  updateApp = (appInfo: AppInfo) => {
    this.appList = this.appList.map((appItem: AppInfo) => {
      if (appItem.id === appInfo.id) {
        return appInfo;
      }
      return appItem;
    });
  }
}

export default new AppListStore();
