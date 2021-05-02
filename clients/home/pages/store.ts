import { observable, action } from 'mobx';
import { TreeData } from '@atlaskit/tree';

import { getPagesTreeData } from '@lib/utils';
import { getPageDataSchema } from '@lib/utils';

import { fetchUserList, fetchPageList, fetchFormScheme } from '../lib/api';

class UserAppStore {
  @observable appList = [];
  @observable appID = '';
  @observable listLoading = false;
  @observable pageListLoading = false;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable formScheme:any = null;
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };

  @action
  fetchPageList = (appID: string) => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      this.pagesTreeData = getPagesTreeData(res.data.menu);
      this.pageListLoading = false;
    });
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
    this.formScheme = null;
    if (pageInfo.id) {
      this.fetchSchemeLoading = true;
      fetchFormScheme(pageInfo.id).then((res: any) => {
        this.formScheme = res.schema;
        const { config, schema } = res.schema;
        getPageDataSchema(config, schema, pageInfo.id as string);
        this.fetchSchemeLoading = false;
      }).catch(() => {
        this.fetchSchemeLoading = false;
      });
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

  @action
  clear = () => {
    this.formScheme = null;
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
    this.curPage = { id: '' };
  }
}

export default new UserAppStore();
