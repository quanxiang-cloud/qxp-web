import { observable, action, toJS, reaction, IReactionDisposer } from 'mobx';
import { omit } from 'lodash';
import { mutateTree, TreeData, TreeItem } from '@atlaskit/tree';

import toast from '@lib/toast';
import { buildAppPagesTreeData } from '@lib/utils';
import AppDataStore from '@c/form-app-data-table/store';

import { fetchAppList } from '../entry/app-list/api';
import {
  fetchAppDetails,
  updateAppStatus,
  updateApp,
  fetchPageList,
  createPage,
  updatePageOrGroup,
  createGroup,
  deleteGroup,
  deletePage,
  fetchFormScheme,
} from './api';

class AppDetailsStore {
  destroySetCurPage: IReactionDisposer;
  @observable appDetails: AppInfo = {
    id: '',
    useStatus: 0,
    appName: '',
    appIcon: '',
  };
  @observable appDataStore: AppDataStore = new AppDataStore({ schema: {} });
  @observable loading = false;
  @observable pageInitList: PageInfo[] = [];
  @observable apps: AppInfo[] = [];
  @observable appID = '';
  @observable pageID = '';
  @observable pageListLoading = true;
  @observable fetchSchemeLoading = false;
  @observable formScheme = null;
  @observable curPage: PageInfo = { id: '' };
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };

  constructor() {
    this.destroySetCurPage = reaction(() => {
      if (!this.pageID || this.pageListLoading) {
        return '';
      }

      return this.pageID;
    }, this.setCurPage);
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  fetchAppList = () => {
    fetchAppList({}).then((res: any) => {
      this.apps = res.data;
    });
  }

  @action
  updateAppStatus = () => {
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
  }

  @action
  fetchAppDetails = (appID: string) => {
    this.loading = true;
    this.appID = appID;
    return fetchAppDetails(appID).then((res: any) => {
      this.appDetails = res || {};
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  @action
  updateApp = (appInfo: Pick<AppInfo, 'appName' | 'appIcon' | 'useStatus'>) => {
    return updateApp({ id: this.appDetails.id, ...appInfo }).then(() => {
      this.appDetails = { ...this.appDetails, ...appInfo };
      this.apps = this.apps.map((_appInfo) => {
        if (_appInfo.id === this.appDetails.id) {
          return { ..._appInfo, ...appInfo };
        }
        return _appInfo;
      });
      toast.success('修改成功！');
    });
  }

  @action
  updatePagesTree = (treeData: TreeData) => {
    this.pagesTreeData = treeData;
  }

  @action
  deletePageOrGroup = (treeItem: TreeItem, type: string) => {
    const data = {
      id: treeItem.data.id,
      appID: treeItem.data.appID,
      sort: treeItem.data.sort,
      groupID: type === 'delGroup' ? '' : treeItem.data.groupID,
    };

    const method = type === 'delGroup' ? deleteGroup : deletePage;

    return method(data).then(() => {
      const items = omit(toJS(this.pagesTreeData.items), treeItem.id as string);
      const groupID = data.groupID || 'ROOT';
      items[groupID] = {
        ...items[groupID],
        children: items[groupID].children?.filter((childID) => childID !== treeItem.id),
      };
      // todo refactor this
      if (this.curPage.id === treeItem.id && type !== 'delGroup') {
        window.history.replaceState('', '', window.location.pathname);
        this.pageID = '';
        this.curPage = { id: '' };
      }

      this.pagesTreeData = {
        items,
        rootId: this.pagesTreeData.rootId,
      };

      toast.success('删除成功');
    });
  }

  @action
  editGroup = (groupInfo: PageInfo) => {
    if (groupInfo.id) {
      return updatePageOrGroup({ appID: this.appID, ...groupInfo }).then(() => {
        this.pagesTreeData = mutateTree(toJS(this.pagesTreeData), groupInfo.id as string, {
          id: groupInfo.id,
          data: groupInfo,
        });

        toast.success('修改成功');
      });
    }

    return createGroup({ appID: this.appID, ...groupInfo }).then((res: any) => {
      const newGroup = { ...res, name: groupInfo.name, menuType: 1, appID: this.appID };
      const items = toJS(this.pagesTreeData.items);
      items.ROOT.children.push(newGroup.id);
      items[newGroup.id] = {
        id: newGroup.id,
        children: [],
        hasChildren: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: newGroup,
      };

      this.pagesTreeData = {
        items,
        rootId: 'ROOT',
      };

      toast.success('创建成功');
    });
  }

  @action
  editPage = (pageInfo: PageInfo) => {
    if (pageInfo.id) {
      return updatePageOrGroup(pageInfo).then(() => {
        toast.success('修改成功');
        this.pagesTreeData = mutateTree(toJS(this.pagesTreeData), pageInfo.id, {
          id: pageInfo.id,
          data: pageInfo,
        });

        if (pageInfo.id === this.curPage.id) {
          this.curPage = pageInfo;
        }
      });
    }

    return createPage({ appID: this.appID, ...pageInfo }).then((res: any) => {
      const newPage = { ...res, ...pageInfo, menuType: 0, appID: this.appID };
      const items = toJS(this.pagesTreeData.items);
      items[newPage.groupID || 'ROOT'].children.push(newPage.id);
      items[newPage.id] = {
        id: newPage.id,
        data: newPage,
        children: [],
        hasChildren: false,
      };

      this.pagesTreeData = { items, rootId: 'ROOT' };
      toast.success('创建成功');
      return res.id;
    });
  }

  @action
  setCurPage = (pageID: string) => {
    if (!pageID) {
      return;
    }

    const pageInfo = this.pagesTreeData.items[pageID].data;
    this.fetchSchemeLoading = true;
    fetchFormScheme(this.appID, pageInfo.id).then((res: any) => {
      this.formScheme = res;
      const { config, schema } = res;
      if (schema) {
        this.appDataStore = new AppDataStore({
          schema: schema,
          config: config,
          appID: this.appID,
          pageID: pageInfo.id,
        });
      }
      this.fetchSchemeLoading = false;
    }).catch(() => {
      this.fetchSchemeLoading = false;
    });

    this.curPage = pageInfo;
  }

  @action
  fetchPageList = (appID: string) => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      this.pageInitList = res.menu;
      this.pagesTreeData = buildAppPagesTreeData(res.menu);
      this.pageListLoading = false;
    });
  }

  @action
  clear = () => {
    this.curPage = { id: '' };
    this.pageListLoading = true;
    this.appID = '';
    this.pageID = '';
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
  }
}

export default new AppDetailsStore();
