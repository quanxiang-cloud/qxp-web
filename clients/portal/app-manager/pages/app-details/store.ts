import { observable, action } from 'mobx';

import TreeStore from '@c/headless-tree/store';
import toast from '@lib/toast';
import { getPageDataSchema, getPageTreeData } from '@lib/utils';
import { TreeNode } from '@c/headless-tree/types';
import {
  fetchAppDetails,
  updateAppStatus,
  updateApp,
  fetchPageList,
  createPage,
  updatePage,
  createGroup,
  updateGroup,
  deleteGroup,
  deletePage,
  movePage,
  fetchFormScheme,
} from '@appLib/api';

import appListStore from '../entry/my-app/store';

class AppDetailsStore {
  @observable appDetails: any = {};
  @observable loading = false;
  @observable appId = '';
  @observable treeStore: TreeStore<any> | null = null;
  @observable pageListLoading = false;
  @observable fetchSchemeLoading = false;
  @observable formScheme = null;
  @observable curPage: PageInfo = {};

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
  updateApp = (appInfo: any) => {
    return updateApp({ id: this.appDetails.id, ...appInfo }).then(() => {
      this.appDetails = { ...this.appDetails, ...appInfo };
      appListStore.updateApp(this.appDetails);
      toast.success('修改成功！');
    });
  }

  @action
  deletePageOrGroup = (node: TreeNode<any>, type: string) => {
    const data = {
      id: node.data.id,
      appID: node.data.appID,
      sort: node.data.sort,
    };

    return (type === 'delGroup' ? deleteGroup({ ...data, group_id: '' }) :
      deletePage({ ...data, group_id: node.data.groupID })).then(() => {
      this.treeStore?.deleteNode(node);
      toast.success('删除成功');
    });
  }

  @action
  editGroup = (groupInfo: GroupInfo, node: TreeNode<any>) => {
    if (groupInfo.id) {
      return updateGroup({ appID: this.appId, ...groupInfo }).then(() => {
        this.treeStore?.updateNode({
          ...node,
          name: groupInfo.name || '',
          data: { ...node.data, ...groupInfo },
        });
        toast.success('修改成功');
      });
    }

    return createGroup({ appID: this.appId, ...groupInfo }).then((res) => {
      const newGroup = { ...res.data, name: groupInfo.name, menuType: 1 };
      this.treeStore?.addChildren('root', [{
        data: newGroup,
        name: newGroup.name || '',
        id: newGroup.id || '',
        path: '',
        isLeaf: false,
        expanded: false,
        order: this.treeStore.rootNode.children?.length || 1,
        visible: true,
        childrenStatus: 'resolved',
        level: 1,
        parentId: 'root',
        children: [],
      }]);
      toast.success('创建成功');
    });
  }

  @action
  editPage = (pageInfo: PageInfo, node: TreeNode<any>) => {
    if (pageInfo.id) {
      return updatePage(pageInfo).then(() => {
        toast.success('修改成功');
        this.treeStore?.updateNode({
          ...node,
          name: pageInfo.name || '',
          data: { ...node.data, ...pageInfo },
        });
      });
    } else {
      return createPage({ appID: this.appId, ...pageInfo }).then((res) => {
        const newPage = { ...res.data, ...pageInfo, menuType: 0 };
        this.treeStore?.addChildren(pageInfo.groupID || 'root', [{
          data: newPage,
          name: newPage.name || '',
          id: newPage.id || '',
          path: '',
          isLeaf: true,
          expanded: false,
          order: this.treeStore.rootNode.children?.length || 1,
          visible: true,
          childrenStatus: 'resolved',
          level: 1,
          parentId: pageInfo.groupID || 'root',
          children: [],
        }]);
        toast.success('创建成功');
      });
    }
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
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
      // todo fix any type
      const treeData: any = {
        data: {},
        name: '',
        id: 'root',
        parentId: '',
        path: '',
        isLeaf: false,
        expanded: true,
        order: 0,
        level: 0,
        visible: true,
        childrenStatus: 'resolved',
        children: [],
      };

      getPageTreeData(res.data.menu, treeData);

      this.treeStore = new TreeStore({
        rootNode: (treeData) as TreeNode<any>,
        hideRootNode: true,
      });
      this.pageListLoading = false;
    });
  }

  @action
  movePage = (moveData: any) => {
    return movePage(moveData);
  }

  @action
  clear = () => {
    this.treeStore = null;
  }
}

export default new AppDetailsStore();
