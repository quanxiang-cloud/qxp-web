import { observable, action } from 'mobx';
import { TreeData } from '@atlaskit/tree';

import { buildAppPagesTreeData } from '@lib/utils';
import { getPageDataSchema } from '@c/app-page-data/utils';

import { fetchUserList, fetchPageList, fetchFormScheme } from '../lib/api';

class UserAppStore {
  @observable appList = [];
  @observable appID = '';
  @observable listLoading = false;
  @observable pageListLoading = true;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable formScheme: any = null;
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };

  @action
  fetchPageList = (appID: string) => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      this.pagesTreeData = buildAppPagesTreeData(res.data.menu);
      this.pageListLoading = false;
    });
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
    if (pageInfo.id === this.curPage.id) {
      return;
    }

    this.formScheme = null;
    if (pageInfo.id) {
      this.fetchSchemeLoading = true;
      fetchFormScheme(pageInfo.id).then((res: any) => {
        const { config, schema } = res.schema;
        Object.keys(schema.properties).forEach((key) => {
          if (schema.properties[key]['x-internal'].permission === 1) {
            schema.properties[key].readOnly = true;
          }
        })

        this.formScheme = res.schema;
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
    return fetchUserList().then((res: any) => {
      this.listLoading = false;
      this.appList = res.data.data || [];
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
