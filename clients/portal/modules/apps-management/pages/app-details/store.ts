import { observable, action, runInAction } from 'mobx';

import toast from '@lib/toast';

import { fetchAppList } from '../entry/app-list/api';

import {
  fetchAppDetails,
  updateAppStatus,
  updateApp,
  appRolePoly,
} from './api';
import Orchestrator from './view-orchestration/orchestrator';
import ArterySpec from '@one-for-all/artery';
import { ROOT_NODE_ID } from './view-orchestration/constants';
import { genDesktopRootArteryKey } from './view-orchestration/helpers/utils';
import { ARTERY_KEY_VERSION } from '@portal/constants';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

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
  @observable lastFocusViewID = '';

  @observable viewStore: Orchestrator | null = null;

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
  fetchAppDetails = (appID: string): Promise<void> => {
    this.loading = true;
    this.appID = appID;
    return fetchAppDetails(appID).then((res: any) => {
      runInAction(() => {
        this.appDetails = res || {};
        this.lastUpdateTime = res.updateTime;
        this.loading = false;
      });
    }).then(() => this.initViewStore(appID)).catch(() => {
      runInAction(() => {
        this.loading = false;
      });
    });
  };

  @action
  updateApp = (appInfo: Pick<AppInfo, 'appName' | 'appIcon' | 'useStatus' | 'appSign' | 'accessURL'>): Promise<void> => {
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

  @action
  setLastFocusViewID = (id: string): void => {
    this.lastFocusViewID = id;
  };

  @action
  setAccessURL = (url: string): Promise<void> => {
    return updateApp({
      id: this.appID,
      accessURL: url,
    }).then(() => {
      runInAction(() => {
        this.appDetails.accessURL = url;
      });
    });
  };

  @action initViewStore = (appID: string): Promise<void> => {
    const rootSchema: ArterySpec.Artery = {
      node: {
        id: 'root_route_node',
        type: 'route-node',
        path: `/a/${appID}`,
        node: { id: ROOT_NODE_ID, type: 'html-element', name: 'div', children: [] },
      },
    };
    const key = genDesktopRootArteryKey(appID);
    const param = { key, version: ARTERY_KEY_VERSION };

    return getBatchGlobalConfig([param])
      .then(({ result }) => parseJSON<ArterySpec.Artery>(result[key], rootSchema))
      .then((appLayoutSchema) => {
        runInAction(() => {
          this.viewStore = new Orchestrator(appID, appLayoutSchema);
        });
      });
  };

  @action clearViewStore = (): void => {
    this.viewStore = null;
  };
}

export default new AppDetailsStore();
