import { observable, action, IReactionDisposer, reaction } from 'mobx';
import { TreeData } from '@atlaskit/tree';

import { buildAppPagesTreeData } from '@lib/utils';

import { fetchUserList, fetchPageList, fetchFormScheme } from '../lib/api';

class UserAppStore {
  destroySetCurPage: IReactionDisposer;
  @observable appList = [];
  @observable appID = '';
  @observable pageID = '';
  @observable listLoading = false;
  @observable pageListLoading = true;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable pageName = '';
  @observable formScheme: ISchema | null = null;
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };
  @observable TODO_LIST = [
    { key: 'OVERTIME', value: 0, name: '已超时', color: 'text-red-600' },
    { key: 'URGE', value: 0, name: '催办', color: 'text-yellow-600' },
    { key: '', value: 0, name: '全部待办', color: 'text-gray-900' },
  ];
  @observable HANDLE_LIST = [
    { key: 0, name: '我发起的', icon: 'addchart', link: 'my_applies' },
    { key: 1, name: '我已处理', icon: 'done_all', link: 'done' },
    { key: 2, name: '抄送给我', icon: 'send_me', count: 0, link: 'cc_to_me' },
  ];

  constructor() {
    this.destroySetCurPage = reaction(() => {
      if (!this.pageID || this.pageListLoading || !this.pagesTreeData.items[this.pageID]) {
        return;
      }

      return this.pagesTreeData.items[this.pageID].data;
    }, this.setCurPage);
  }

  @action
  fetchPageList = (appID: string) => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      this.pagesTreeData = buildAppPagesTreeData(res.menu);
      this.pageListLoading = false;
    });
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
    if (!pageInfo) {
      return;
    }

    this.formScheme = null;
    this.fetchSchemeLoading = true;
    fetchFormScheme(this.appID, pageInfo.id).then((res: any) => {
      this.pageName = pageInfo.name || '';
      this.formScheme = res.schema;
      this.fetchSchemeLoading = false;
    }).catch(() => {
      this.fetchSchemeLoading = false;
    });
    this.curPage = pageInfo;
  }

  @action
  fetchAppList = () => {
    this.listLoading = true;
    return fetchUserList().then((res: any) => {
      this.listLoading = false;
      this.appList = res.data || [];
    }).catch(() => {
      this.listLoading = false;
    });
  }

  @action
  clear = () => {
    this.formScheme = null;
    this.pageListLoading = true;
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
    this.curPage = { id: '' };
  }
}

export default new UserAppStore();
