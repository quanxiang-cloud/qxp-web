import { cloneDeep, omit, pick } from 'lodash';
import { History } from 'history';
import { observable, action, toJS, reaction, IReactionDisposer, runInAction } from 'mobx';
import { mutateTree, TreeData, TreeItem } from '@atlaskit/tree';

import toast from '@lib/toast';
import { buildAppPagesTreeData } from '@lib/utils';
import { getCustomPageInfo, getSchemaPageInfo, getTableSchema } from '@lib/http-client';

import { BindState, CardList, CustomPageInfo, MenuType } from './type';
import { fetchAppList } from '../entry/app-list/api';
import { DefaultPageDescriptions } from './constants';
import { getNextTreeItem } from './page-menu-design/app-pages-tree';
import {
  getPageCardList,
  filterDeletedPage,
  mapToSchemaPageDescription,
  mapToCustomPageDescription,
  hasActiveMenu,
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
  isHiddenMenu,
  formDuplicate,
} from './api';
import { getFirstMenu } from './page-menu-design/menu-tree/utils';
import { Menu } from './page-menu-design/menu-tree/type';

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

const DEFAULT_MENU = { id: '' };

function getDefaultMenu(extraInfo: Record<string, unknown>): Menu {
  const DEFAULT_INSERT_MENU = {
    id: '',
    bindingState: 20,
    child: null,
    childCount: 0,
    describe: '',
    groupID: '',
    icon: '',
    isHide: false,
    menuType: 0,
    name: '',
  };

  return { ...DEFAULT_INSERT_MENU, ...extraInfo };
}
class AppDetailsStore {
  destroySetCurPage: IReactionDisposer;
  @observable appDetails: AppInfo = {
    id: '',
    useStatus: 0,
    appName: '',
    appIcon: '',
    appSign: '',
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
  @observable menuTree = [];
  @observable activeMenu: Menu = DEFAULT_MENU;
  @observable lastHover: Menu = DEFAULT_MENU;
  @observable draggingNode: any = null;

  constructor() {
    this.destroySetCurPage = reaction(() => {
      if (!this.pageID || this.pageListLoading) {
        return '';
      }
      return this.pageID;
    }, this.setCurPage);
  }

  @action
  setPageID = (pageID: string): void => {
    this.pageID = pageID;
  }

  @action
  setModalType = (modalType: string): void => {
    this.modalType = modalType;
  }

  @action
  fetchAppList = (): void => {
    fetchAppList({}).then((res: any) => {
      this.apps = res.data;
    });
  }

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
  }

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
    }).catch(() => {
      runInAction(() => {
        this.loading = false;
      });
    });
  }

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
  }

  @action
  updatePagesTree = (treeData: TreeData): void => {
    this.pagesTreeData = treeData;
  }

  @action del = async (delItem: Menu, type: string): Promise<void> => {
    const dto = {
      id: delItem.id,
      appID: delItem.appID,
      sort: delItem.sort,
      groupID: type === 'delGroup' ? '' : delItem.groupID,
    };
    const delMethod = type === 'delGroup' ? deleteGroup : deletePage;

    return delMethod(dto)
      .then(() => {
        toast.success('删除成功');
        let deletedList = cloneDeep(this.pageInitList);
        if (!dto.groupID) {
          deletedList = this.pageInitList.filter((item: Menu) => item.id !== dto.id);
        } else {
          const child = deletedList.find((item: Menu) => item.id === dto.groupID)?.child || [];
          deletedList.forEach((item: Menu) => {
            if (item.id === dto.groupID) {
              item.child = child.filter((item: Menu) => item.id !== dto.id);
            }
          });
        }
        this.pageInitList = deletedList;
        this.activeMenu = getFirstMenu(deletedList);
      })
      .catch((err) => {
        toast.error(err || '删除是啊比');
      });
  }

  @action
  deletePageOrGroup = async ({
    treeItem, type, history, pathname,
  }: DeletePageOrGroupParams): Promise<void> => {
    const data = {
      id: treeItem.id,
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
  editGroup = (groupInfo: PageInfo): Promise<void> => {
    if (groupInfo.id) {
      return updatePageOrGroup({ appID: this.appID, ...groupInfo }).then(() => {
        const editGroupData = this.pageInitList.map((item) => {
          if (item.id === groupInfo.id) {
            item.name = groupInfo.name;
          }
          return item;
        });
        this.updatePageInitList(editGroupData);
        toast.success('修改成功');
      });
    }

    return createGroup({ appID: this.appID, ...groupInfo }).then((res: any) => {
      const newGroup = getDefaultMenu({
        ...res,
        name: groupInfo.name,
        menuType: 1,
        appID: this.appID,
        sort: Math.max.apply(null, this.pageInitList.map((item: Menu) => Number(item.sort))) + 1,
      });
      this.pageInitList.push(newGroup);
      toast.success('创建成功');
    });
  }
  // 'editPage', 'createPage', 'copyPage'
  @action
  editPage = (pageInfo: PageInfo): Promise<void> => {
    if (this.modalType === 'editPage') {
      return updatePageOrGroup(pageInfo).then(() => {
        toast.success('修改成功');

        const editName = (pageInitList: Menu[]): Menu[] => {
          return (pageInitList || []).map((item: Menu) => {
            if (item.id === pageInfo.id) {
              this.setActiveMenu(pageInfo);
              return pageInfo;
            } else if (item.child?.length) {
              item.child = editName(item.child);
            }
            return item;
          });
        };
        this.updatePageInitList(editName(this.pageInitList));
      });
    }
    // copyPage
    const PageInfoPick = pick(pageInfo, 'name', 'icon', 'describe', 'groupID');
    if (pageInfo.bindingState === BindState.isBind && pageInfo.menuType === MenuType.schemaForm) {
      return formDuplicate(this.appID, {
        name: pageInfo.name || '',
        icon: pageInfo.icon || '',
        describe: pageInfo.describe || '',
        groupID: pageInfo.groupID || '',
        duplicateTableID: pageInfo.id,
      }).then((res: { id: string }) => {
        this.addNewPageToList(PageInfoPick, res.id);
      });
    }
    // create
    return createPage({ appID: this.appID, ...PageInfoPick }).then((res: { id: string }) => {
      this.addNewPageToList(PageInfoPick, res.id);
    });
  }

  @action
  addNewPageToList = (PageInfoPick: Partial<PageInfo>, id: string): string => {
    const newPage: PageInfo = {
      ...getDefaultMenu({
        id,
        appID: this.appID,
      }),
      ...PageInfoPick,
    };

    // edit
    if (!newPage.groupID) {
      newPage.sort = this.pageInitList.length + 1;
      this.pageInitList.push(newPage);
      this.activeMenu = newPage;
      toast.success('创建成功');
      return id;
    }

    this.pageInitList = this.pageInitList.map((page) => {
      if (page.id === newPage.groupID) {
        const lastChildPage = page.child?.slice(-1) || [];
        const sort = lastChildPage[0]?.sort || 0;
        newPage.sort = sort + 1;

        page.child = ((page?.child || [])?.concat([newPage]));
        page.childCount = page.child.length;
        this.activeMenu = newPage;
      }
      return page;
    });

    toast.success('创建成功');
    return id;
  }

  @action
  setCurPage = (pageID: string): void => {
    if (!pageID) {
      return;
    }

    const pageInfo = this.activeMenu;
    this.fetchSchemeLoading = true;
    this.curPageCardList = DEFAULT_CARD_LIST;

    if (pageInfo.menuType === MenuType.schemaForm) {
      getTableSchema(this.appID, pageInfo.id).then((pageSchema) => {
        this.hasSchema = !!pageSchema;
        if (!this.appID) return;
        if (this.hasSchema) {
          return getSchemaPageInfo(this.appID, pageID);
        }
      }).then((res) => {
        if (!this.pageID) return;
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
        runInAction(() => {
          this.fetchSchemeLoading = false;
        });
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
  updatePageHideStatus = (appID: string, pageInfo: PageInfo) => {
    return isHiddenMenu(appID, { id: pageInfo.id, hide: pageInfo.isHide ? false : true }).then(() => {
      const hideMenu = (pageInitList: Menu[]): Menu[] => {
        return (pageInitList || []).map((item: Menu) => {
          if (item.id === pageInfo.id) {
            this.setActiveMenu(pageInfo);
            item.isHide = !pageInfo.isHide;
          } else if (item.child?.length) {
            item.child = hideMenu(item.child);
          }
          return item;
        });
      };

      this.updatePageInitList(hideMenu(this.pageInitList));
      toast.success(`${pageInfo.name}页面${!pageInfo.isHide ? '隐藏' : '显示'}成功`);
    }).catch(() => toast.error('页面设置显示或者隐藏失败'));
  }

  @action
  fetchPageList = (appID: string): void => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      this.pageInitList = res.menu;
      if (!hasActiveMenu(res.menu, this.activeMenu)) {
        this.activeMenu = getFirstMenu(res.menu);
      }
      this.pagesTreeData = buildAppPagesTreeData(res.menu);
    }).catch(() => {
      toast.error('获取菜单列表失败');
    }).finally(() => {
      this.pageListLoading = false;
    });
  }

  @action
  clear = (): void => {
    this.curPage = { id: '' };
    this.pageListLoading = true;
    this.appID = '';
    this.pageID = '';
    this.activeMenu = DEFAULT_MENU;
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
  }

  @action setActiveMenu = (menuItem: Menu): void => {
    this.activeMenu = menuItem;
  }

  @action updatePageInitList = (newPageList: PageInfo[]): void => {
    this.pageInitList = newPageList;
  }

  @action setLastHover = (menuItem: Menu): void => {
    this.lastHover = menuItem;
  }

  @action setDraggingNode = (node: any): void => {
    this.draggingNode = node;
  }
}

export default new AppDetailsStore();
