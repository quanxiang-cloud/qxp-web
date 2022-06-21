import { observable, action, runInAction } from 'mobx';

import toast from '@lib/toast';

import { fetchAppList } from '../entry/app-list/api';

import {
  fetchAppDetails,
  updateAppStatus,
  updateApp,
  appRolePoly,
} from './api';
class AppDetailsStore {
  @observable appDetails: AppInfo = {
    id: '',
    useStatus: 0,
    appName: '',
    appIcon: '',
    appSign: '',
    accessURL: '',
    perPoly: false,
  };
  @observable loading = false;
  @observable lastUpdateTime = 0;
  @observable apps: AppInfo[] = [];
  @observable appID = '';

  @action
  fetchAppList = (): void => {
    fetchAppList({}).then((res: any) => {
      this.apps = res.data;
    });
  };

  @action
  updateAppStatus = (): Promise<void> => {
    const { id, useStatus } = this.appDetails;
    return updateAppStatus({ id, useStatus: -1 * useStatus }).then(() => {
      this.appDetails.useStatus = -1 * useStatus;
      this.apps = this.apps.map((appInfo) => {
        if (appInfo.id === id) {
          return { ...appInfo, ...this.appDetails };
        }

        return appInfo;
      });
      toast.success(useStatus < 0 ? '发布成功！' : '下架成功');
    });
  };

  @action
  fetchAppDetails = (appID: string): Promise<AppInfo> => {
    this.loading = true;
    this.appID = appID;
    return fetchAppDetails(appID).then((res: any) => {
      runInAction(() => {
        this.appDetails = res || {};
        this.lastUpdateTime = res.updateTime;
        this.loading = false;
      });
      return res;
    }).catch(() => {
      runInAction(() => {
        this.loading = false;
      });
    });
  };

  @action
  updateApp = (appInfo: Pick<AppInfo, 'appName' | 'appIcon' | 'useStatus' | 'appSign'>): Promise<void> => {
    return updateApp({ id: this.appDetails.id, ...appInfo }).then(() => {
      this.appDetails = { ...this.appDetails, ...appInfo };
      this.apps = this.apps.map((_appInfo) => {
        if (_appInfo.id === this.appDetails.id) {
          return { ..._appInfo, ...appInfo };
        }
        return _appInfo;
      });
      this.fetchAppDetails(this.appID).then(() => {
        toast.success('修改成功！');
      });
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  setRolePoly = (polyRole: boolean): void => {
    this.appDetails.perPoly = polyRole;
  };

  @action
  updateAppRolePoly = (polyRole: boolean): Promise<void> => {
    return appRolePoly(this.appID, polyRole );
  };
}

export default new AppDetailsStore();
