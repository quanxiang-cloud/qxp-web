import { action, observable } from 'mobx';

import { fetchUserList } from '@home/lib/api';
import { parseAppIcon } from '@m/pages/dashboard/workbench/utils';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { fetchFormDataList, fetchPageList } from '@lib/http-client';
import toast from '@lib/toast';
import { FetchPageListResponse, Menu } from '../types';
import { mapMenu } from '../utils';

interface AppDetail {
  name: string;
  color: string;
  id: string;
}

class UserAppsStore {
  @observable app?: AppDetail;
  @observable state = { loading: false, error: '' };
  @observable authority = 0;
  @observable menu = [] as Menu[];
  @observable records = [] as Menu[];

  @action init = (app: AppDetail | string): void => {
    if (typeof app === 'string') {
      this.initApp(app);
    } else {
      this.app = app as AppDetail;
    }
  };

  @action initApp = (appId: string): void => {
    if (this.app?.id !== appId) {
      this.state = { loading: true, error: '' };
      fetchUserList().then((res: any) => {
        const appFound: AppInfo = res.data.find(({ id }: AppInfo) => id === appId);
        if (!appFound) {
          this.state = { loading: false, error: '应用不存在' };
          return;
        }
        const appIcon = parseAppIcon(appFound.appIcon);
        this.app = { name: appFound.appName, color: appIcon.bgColor, id: appId };

        this.initPageList();
      }).catch(() => {
        this.state = { loading: false, error: '获取app页面列表失败' };
      });
    } else {
      this.initPageList();
    }
  };

  @action initPageList = (): void => {
    if (!this.app) return;
    const appID = this.app.id;
    this.state = { loading: true, error: '' };
    fetchPageList(appID).then((res) => {
      const menuMapped = mapMenu(res as FetchPageListResponse);
      this.menu = menuMapped;
      this.state = { loading: false, error: '' };
      this.initRecords(menuMapped);
    }).catch(() => {
      this.state = { loading: false, error: '获取页面列表失败' };
    });
  };

  @action initRecords = (menu: Menu[]): void => {
    if (!this.app) return;
    const appID = this.app.id;
    const filteredMenu = menu?.filter((m) => m.menuType === MenuType.schemaForm);
    Promise.all(
      filteredMenu?.map((m) => {
        return fetchFormDataList(appID, m.id, {
          page: 1,
          query: { bool: { must: [] } },
          sort: [],
          size: 1,
        });
      }) || []).then((response) => {
      const records = Array<Menu>();
      response?.forEach((res, index) => {
        const count = res?.total;
        if (menu) {
          const m = filteredMenu[index];
          if (count) {
            m.applyCount = count;
            records.push(m);
          }
        }
      });
      this.records = records;
    }).catch((e) => toast.error(e));
  };

  @action clear = (): void => {
    this.app = undefined;
    this.state = { loading: false, error: '' };
    this.authority = 0;
    this.menu = [];
    this.records = [];
  };
}

export default new UserAppsStore();
