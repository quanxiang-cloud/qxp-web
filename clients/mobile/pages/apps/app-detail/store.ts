import { action, observable } from 'mobx';

import { fetchUserList } from '@home/lib/api';
import { parseAppIcon } from '@m/pages/dashboard/workbench/utils';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { fetchFormDataList } from '@lib/http-client-form';
import { fetchPageListSchema, getPageMenuSchema } from '@lib/http-client';
import toast from '@lib/toast';
import { Menu } from '../types';
import { ARTERY_KEY_VERSION } from '@portal/constants';
import { get } from 'lodash';

interface AppDetail {
  name: string;
  color: string;
  id: string;
  accessURL?: string;
}

class UserAppsStore {
  @observable app?: AppDetail;
  @observable tableID?: string;
  @observable name?: string;
  @observable state = { loading: false, error: '' };
  @observable authority = 0;
  @observable menu = [] as Menu[];
  @observable goLink = [] as any[];
  @observable records = [] as Menu[];

  @action init = (app: AppDetail | string): void => {
    if (typeof app === 'string') {
      this.initApp(app);
    } else {
      this.app = app as AppDetail;
    }
  };

  @action initApp = (appId: string): void => {
    this.state = { loading: true, error: '' };
    fetchUserList().then((res: any) => {
      const appFound: AppInfo = res.data.find(({ id }: AppInfo) => id === appId);
      if (!appFound) {
        this.state = { loading: false, error: '应用不存在' };
        return;
      }
      const appIcon = parseAppIcon(appFound.appIcon);
      this.app = { name: appFound.appName, color: appIcon.bgColor, id: appId,
        accessURL: appFound.accessURL };

      this.initPageList();
    }).catch(() => {
      this.state = { loading: false, error: '获取app页面列表失败' };
    });
    // if (this.app?.id !== appId) {
    //   this.state = { loading: true, error: '' };
    //   fetchUserList().then((res: any) => {
    //     const appFound: AppInfo = res.data.find(({ id }: AppInfo) => id === appId);
    //     if (!appFound) {
    //       this.state = { loading: false, error: '应用不存在' };
    //       return;
    //     }
    //     const appIcon = parseAppIcon(appFound.appIcon);
    //     this.app = { name: appFound.appName, color: appIcon.bgColor, id: appId,
    //       accessURL: appFound.accessURL};

    //     this.initPageList(appFound);
    //   }).catch(() => {
    //     this.state = { loading: false, error: '获取app页面列表失败' };
    //   });
    // } else {
    //   this.initPageList();
    // }
  };

  @action initPageList = (linkPath?: string): void => {
    if (!this.app) return;
    const appID = this.app.id;
    this.state = { loading: true, error: '' };
    // fetchPageList(appID).then((res) => {
    //   const menuMapped = mapMenu(res as FetchPageListResponse);
    //   this.menu = menuMapped;
    //   this.state = { loading: false, error: '' };
    //   this.initRecords(menuMapped);
    // }).catch(() => {
    //   this.state = { loading: false, error: '获取页面列表失败' };
    //   this.state = { loading: false, error: '' };
    // });

    fetchPageListSchema(appID, ARTERY_KEY_VERSION).then((res) => {
      const pathList = linkPath ? linkPath.split('/') : this.app?.accessURL?.split('/') || [];
      const path = pathList[pathList.length - 1];
      const node = get(res, 'artery.node.node.children')?.filter((item: any)=>item?.path === path) || [];
      const tableID = get(node[0], 'node.props.tableID.value') || '';
      let _node = [];
      let _tableID = '';
      try {
        const nodeList = get(res, 'artery.node.node.children');
        let newNodeList: any = [];
        nodeList.forEach((item: any)=>{
          if (item.children) {
            newNodeList = [...newNodeList, ...item.children];
          } else {
            newNodeList = [...newNodeList, item];
          }
        });
        _node = newNodeList?.filter((item: any)=>item?.path === path) || [];
        _tableID = get(_node[0], 'node.props.tableID.value') || '';
      } catch (error) {
        console.log(error);
      }

      const name = get(_node[0], 'node.props.name.value') || '';
      this.tableID = _tableID;
      this.name = name;
      this.state = { loading: false, error: '' };

      const menuArteryID = get(res, 'artery.node.node.children[0].children[0].arteryID') || '';

      getPageMenuSchema(menuArteryID, ARTERY_KEY_VERSION).then((res)=>{
        const NavigateMenuNode = get(res, 'artery.node.children')?.filter((item)=>item.exportName === 'NavigateMenu')[0] || {};
        const menus = get(NavigateMenuNode, 'props.menus.value') || [];
        this.menu = menus;
        this.goLink = get(res, 'artery.node.children[0].props.goLink') || {
          type: 'functional_property',
          func: {
            type: 'raw',
            args: 'path',
            body: `
              this.history.push(path);
            `,
          } };
      });
    }).catch(() => {
      this.state = { loading: false, error: '' };
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
