import { observable, action, toJS } from 'mobx';
import { omit } from 'lodash';
import { mutateTree, TreeData, TreeItem } from '@atlaskit/tree';

import toast from '@lib/toast';
import { buildAppPagesTreeData } from '@lib/utils';
import { getPageDataSchema } from '@c/app-page-data/utils';
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
} from '@portal/modules/apps-management/lib/api';

import appListStore from '../entry/my-app/store';

class AppDetailsStore {
  @observable appDetails: AppInfo = {
    id: '',
    useStatus: 0,
    appName: '',
    appIcon: '',
  };
  @observable loading = false;
  @observable appId = '';
  @observable pageListLoading = false;
  @observable fetchSchemeLoading = false;
  @observable formScheme = null;
  @observable curPage: PageInfo = { id: '' };
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };

  @action
  updateAppStatus = () => {
    const { id, useStatus } = this.appDetails;
    return updateAppStatus({ id, useStatus: -1 * useStatus }).then(() => {
      this.appDetails.useStatus = -1 * useStatus;
      appListStore.updateApp(this.appDetails);
      toast.success(useStatus < 0 ? '发布成功！' : '下架成功');
    });
  }

  @action
  fetchAppDetails = (appId: string) => {
    this.loading = true;
    this.appId = appId;
    return fetchAppDetails(appId).then((res) => {
      this.appDetails = res.data || {};
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  @action
  updateApp = (appInfo: Pick<AppInfo, 'appName' | 'appIcon' | 'useStatus'>) => {
    return updateApp({ id: this.appDetails.id, ...appInfo }).then(() => {
      this.appDetails = { ...this.appDetails, ...appInfo };
      appListStore.updateApp(this.appDetails);
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
      this.pagesTreeData = {
        items,
        rootId: this.pagesTreeData.rootId,
      };

      // todo refactor this
      if (this.curPage.id === treeItem.id && type !== 'delGroup') {
        this.curPage = { id: '' };
      }

      toast.success('删除成功');
    });
  }

  @action
  editGroup = (groupInfo: PageInfo) => {
    if (groupInfo.id) {
      return updatePageOrGroup({ appID: this.appId, ...groupInfo }).then(() => {
        this.pagesTreeData = mutateTree(toJS(this.pagesTreeData), groupInfo.id as string, {
          id: groupInfo.id,
          data: groupInfo,
        });

        toast.success('修改成功');
      });
    }

    return createGroup({ appID: this.appId, ...groupInfo }).then((res) => {
      const newGroup = { ...res.data, name: groupInfo.name, menuType: 1, appID: this.appId };
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

    return createPage({ appID: this.appId, ...pageInfo }).then((res) => {
      const newPage = { ...res.data, ...pageInfo, menuType: 0, appID: this.appId };
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
    });
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
    if (pageInfo.id === this.curPage.id) {
      return;
    }

    if (pageInfo.id) {
      this.fetchSchemeLoading = true;
      fetchFormScheme(pageInfo.id).then((res) => {
        this.formScheme = res.data;
        const { config, schema } = res.data;
        getPageDataSchema(config, schema, pageInfo.id as string);
        this.fetchSchemeLoading = false;
      }).catch(() => {
        this.fetchSchemeLoading = false;
      });
    } else {
      this.formScheme = null;
    }

    this.curPage = pageInfo;
  }

  @action
  fetchPageList = (appId: string) => {
    this.appId = appId;
    this.pageListLoading = true;
    fetchPageList(appId).then((res) => {
      this.pagesTreeData = buildAppPagesTreeData(res.data.menu);
      this.pageListLoading = false;
    });
  }

  @action
  clear = () => {
    this.curPage = { id: '' };
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
  }
}

export default new AppDetailsStore();
