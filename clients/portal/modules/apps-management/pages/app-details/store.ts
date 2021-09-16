import { omit } from 'lodash';
import { History } from 'history';
import { mutateTree, TreeData, TreeItem } from '@atlaskit/tree';
import { observable, action, toJS, reaction, IReactionDisposer } from 'mobx';

import toast from '@lib/toast';
import { buildAppPagesTreeData } from '@lib/utils';
import { getCustomPageInfo, getSchemaPageInfo, getTableSchema } from '@lib/http-client';

import { CardList, CustomPageInfo, MenuType } from './type';
import { fetchAppList } from '../entry/app-list/api';
import { DefaultPageDescriptions } from './constants';
import { getNextTreeItem } from './page-menu-design/app-pages-tree';
import {
  getPageCardList,
  filterDeletedPage,
  mapToSchemaPageDescription,
  mapToCustomPageDescription,
} from './utils';
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
} from './api';

type DeletePageOrGroupParams = {
  treeItem: TreeItem;
  type: string;
  history?: History;
  pathname: string
}

const DEFAULT_CARD_LIST = [
  {
    id: 'linkedFlows',
    title: '关联工作流',
    list: [],
  },
  {
    id: 'AuthorizedRoles',
    title: '已授权角色',
    list: [],
  },
];

class AppDetailsStore {
  destroySetCurPage: IReactionDisposer;
  @observable appDetails: AppInfo = {
    id: '',
    useStatus: 0,
    appName: '',
    appIcon: '',
  };
  @observable loading = false;
  @observable lastUpdateTime = 0
  @observable pageInitList: PageInfo[] = [];
  @observable apps: AppInfo[] = [];
  @observable appID = '';
  @observable pageID = '';
  @observable pageListLoading = true;
  @observable fetchSchemeLoading = false;
  @observable hasSchema = false;
  @observable curPage: PageInfo = { id: '' };
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };
  @observable modalType = '';
  @observable curPreviewUrl = '';
  @observable curPageCardList: CardList[] = DEFAULT_CARD_LIST;
  @observable pageDescriptions = DefaultPageDescriptions;

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
  setModalType = (modalType : string): void => {
    this.modalType = modalType;
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
      this.lastUpdateTime = res.updateTime;
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
      this.fetchAppDetails(this.appID).then(() => {
        toast.success('修改成功！');
      });
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  updatePagesTree = (treeData: TreeData) => {
    this.pagesTreeData = treeData;
  }

  @action
  deletePageOrGroup = async ({
    treeItem, type, history, pathname,
  }: DeletePageOrGroupParams): Promise<void> => {
    const data = {
      id: treeItem.data.id,
      appID: treeItem.data.appID,
      sort: treeItem.data.sort,
      groupID: type === 'delGroup' ? '' : treeItem.data.groupID,
    };

    const method = type === 'delGroup' ? deleteGroup : deletePage;

    await method(data);
    const treeItems = toJS(this.pagesTreeData.items);
    const items = omit(treeItems, treeItem.id as string);
    const nextTreeItem = getNextTreeItem(treeItem, treeItems);

    const groupID = data.groupID || 'ROOT';
    items[groupID] = {
      ...items[groupID],
      children: items[groupID].children?.filter((childID) => childID !== treeItem.id),
    };
    // todo refactor this
    if (this.curPage.id === treeItem.id && type !== 'delGroup') {
      history?.replace(pathname);
      this.pageID = '';
      this.curPage = { id: '' };
    }

    this.pagesTreeData = {
      items,
      rootId: this.pagesTreeData.rootId,
    };

    this.pageInitList = filterDeletedPage(groupID, treeItem.data.id, toJS(this.pageInitList));
    toast.success('删除成功');

    if (nextTreeItem && nextTreeItem.id !== treeItem.data.id) {
      this.curPage = nextTreeItem?.data;
      return;
    }
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
      const newPage: PageInfo = {
        ...res, ...pageInfo, menuType: 0, appID: this.appID, child: null, childCount: 0, sort: 0,
      };
      const items = toJS(this.pagesTreeData.items);
      items[newPage.groupID || 'ROOT'].children.push(newPage.id);
      items[newPage.id] = {
        id: newPage.id,
        data: newPage,
        children: [],
        hasChildren: false,
      };

      this.pagesTreeData = { items, rootId: 'ROOT' };

      if (!newPage.groupID) {
        this.pageInitList.push(newPage);
        this.curPage = newPage;
        toast.success('创建成功');
        return res.id;
      }

      this.pageInitList = this.pageInitList.map((page) => {
        if (page.id === newPage.groupID) {
          const lastChildPage = page.child?.slice(-1) || [];
          const sort = lastChildPage[0]?.sort || 0;
          newPage.sort = sort + 1;

          page.childCount = page.child?.push(newPage);
          this.curPage = newPage;
        }
        return page;
      });
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
    this.curPageCardList = DEFAULT_CARD_LIST;

    if (pageInfo.menuType === MenuType.schemaForm) {
      getTableSchema(this.appID, pageInfo.id).then((pageSchema) => {
        this.hasSchema = !!pageSchema;
        if (this.hasSchema) {
          return getSchemaPageInfo(this.appID, pageID);
        }
      }).then((res) => {
        if (res) {
          const descriptions = this.pageDescriptions.map((description) => {
            return mapToSchemaPageDescription(description, res);
          });
          this.pageDescriptions = [...descriptions];
          this.curPreviewUrl = '';
          return getPageCardList(this.appID, this.pageID, this.curPageCardList, pageInfo.menuType);
        }
        this.pageDescriptions = DefaultPageDescriptions;
      }).then((res) => {
        if (res) {
          this.curPageCardList = res;
          return;
        }
        this.curPageCardList = DEFAULT_CARD_LIST;
      }).catch(() => {
        toast.error('获取表单信息失败');
      }).finally(() => {
        this.fetchSchemeLoading = false;
      });
    }

    if (pageInfo.menuType === MenuType.customPage) {
      getCustomPageInfo(this.appID, pageInfo.id).then((res) => {
        const descriptions = this.pageDescriptions.map((description) => {
          return mapToCustomPageDescription(description, res);
        });
        this.pageDescriptions = [...descriptions];
        this.curPreviewUrl = res.fileUrl || '';
        return getPageCardList(this.appID, this.pageID, this.curPageCardList, pageInfo.menuType);
      }).then((res) => {
        this.curPageCardList = res;
      }).catch(() => {
        toast.error('获取自定义页面信息失败');
      }).finally(() => {
        this.fetchSchemeLoading = false;
      });
    }

    this.curPage = pageInfo;
  }

  @action
  setCurPageMenuType = (menuType: number, data: CustomPageInfo): void => {
    const curPageInfo = { ...this.curPage, menuType: menuType, fileUrl: data.fileUrl };
    const descriptions = this.pageDescriptions.map((description) => {
      return mapToCustomPageDescription(description, data);
    });

    this.pagesTreeData = mutateTree(toJS(this.pagesTreeData), curPageInfo.id, {
      id: curPageInfo.id,
      data: curPageInfo,
    });
    this.curPage = curPageInfo;
    this.pageDescriptions = descriptions;
    this.curPreviewUrl = data.fileUrl || '';
    getPageCardList(this.appID, this.pageID, this.curPageCardList, curPageInfo.menuType).then((res) => {
      this.curPageCardList = res;
    });
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
