import { observable, action } from 'mobx';

import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';
import { getPageTreeData } from '@lib/utils';
import { getPageDataSchema } from '@lib/utils';

import { fetchUserList, fetchPageList, fetchFormScheme } from '../lib/api';

class UserAppStore {
  @observable appList = [];
  @observable appID = '';
  @observable listLoading = false;
  @observable pageListLoading = false;
  @observable curPage: PageInfo = {};
  @observable fetchSchemeLoading = true;
  @observable formScheme:any = null;
  @observable treeStore: TreeStore<any> | null = null;

  @action
  fetchPageList = (appID: string) => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      const treeData = {
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
  setCurPage = (pageInfo: PageInfo) => {
    if (pageInfo.id) {
      this.fetchSchemeLoading = true;
      fetchFormScheme(pageInfo.id).then((res: any) => {
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
  fetchAppList = () => {
    this.listLoading = true;
    fetchUserList().then((res: any) => {
      this.listLoading = false;
      this.appList = res.data.data || [];
    }).catch(() => {
      this.listLoading = false;
    });
  }
}

export default new UserAppStore();
