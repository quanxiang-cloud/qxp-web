import { observable, action, reaction, IReactionDisposer, computed } from 'mobx';

import toast from '@lib/toast';
import { subscribeStatusChange } from '@c/task-lists/utils';

import { updateAppStatus, createPage } from '../../app-details/api';
import {
  delApp,
  createdApp,
  fetchAppList,
  CreatedAppRes,
  createDummyApp,
  createImportAppTask,
  createAppByTemplateTask,
} from './api';

export type Params = {
  appName?: string;
  useStatus?: number;
}

type CountMapsParams = {
  all: number;
  published: number;
  unPublished: number;
}

class AppListStore {
  searchChange: IReactionDisposer;
  constructor() {
    this.searchChange = reaction(() => this.params, this.fetchAppList);
  }

  @observable appList: AppInfo[] = [];
  @observable allAppList: AppInfo[] = [];
  @observable params: Params = { useStatus: 0, appName: '' };
  @observable isListLoading = false;

  @computed get countMaps(): CountMapsParams {
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
  delApp = (_id: string): Promise<void> => {
    return delApp(_id).then(() => {
      this.appList = this.appList.filter(({ id }) => id !== _id);
      this.allAppList = this.allAppList.filter(({ id }) => id !== _id);
      toast.success('删除成功！');
    });
  };

  @action
  updateAppStatus = (id: string, useStatus: number): Promise<void | AppInfo> => {
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
  };

  @action
  fetchAppList = (params: Params): Promise<void> => {
    this.isListLoading = true;
    return fetchAppList(params).then((res: any) => {
      this.appList = res?.data || [];
      if (params.useStatus === 0 && params.appName === '') {
        this.allAppList = this.appList;
      }
      this.isListLoading = false;
    }).catch(() => {
      this.isListLoading = false;
    });
  };

  @action
  changeParams = (newParams: Params): void => {
    this.params = { ...this.params, ...newParams };
  };

  @action
  createdApp = (appInfo: AppInfo): Promise<string> => {
    return createdApp(appInfo).then((res: CreatedAppRes) => {
      const newApp = { ...appInfo, ...res };
      this.appList = [newApp, ...this.appList];
      this.allAppList = [newApp, ...this.allAppList];
      createPage({
        describe: undefined,
        icon: 'event_available',
        name: '示例页面',
        appID: res.id, id: '',
      });
      return newApp.id;
    });
  };

  @action
  importApp = async (appInfo: AppInfo): Promise<any> => {
    const createdAppRes = await createDummyApp(appInfo);
    const taskRes = await createImportAppTask({
      ...appInfo.appZipInfo,
      title: `【${appInfo.appName}】 应用导入`,
      value: { appID: createdAppRes.id },
    });
    const newApp = { ...appInfo, ...createdAppRes, useStatus: -2 };
    const [isFinish, isSuccess] = await subscribeStatusChange(taskRes.taskID, '导入');
    if (isFinish) {
      newApp.useStatus = isSuccess ? -1 : -3;
    }
    this.appList = [newApp, ...this.appList];
    this.allAppList = [newApp, ...this.allAppList];
  };

  @action
  createdAppByTemplate = async (appInfo: AppInfo): Promise<any> => {
    if (!appInfo.template) {
      return;
    }

    const createdAppRes = await createDummyApp(appInfo);
    const taskRes = await createAppByTemplateTask(
      `【${appInfo.appName}】 模版应用创建`,
      { templateID: appInfo.template, appID: createdAppRes.id },
    );
    const newApp = { ...appInfo, ...createdAppRes, useStatus: -2 };
    const isFinish = await subscribeStatusChange(taskRes.taskID, '导入');
    if (isFinish) {
      newApp.useStatus = -1;
    }
    this.appList = [newApp, ...this.appList];
    this.allAppList = [newApp, ...this.allAppList];
  };

  @action
  updateApp = (appInfo: AppInfo): void => {
    this.allAppList = this.allAppList.map((appItem: AppInfo) => {
      if (appItem.id === appInfo.id) {
        return appInfo;
      }
      return appItem;
    });
  };
}

export default new AppListStore();
