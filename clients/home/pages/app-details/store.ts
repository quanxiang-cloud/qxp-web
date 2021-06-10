import { action, reaction, IReactionDisposer, observable } from 'mobx';
import { TreeData } from '@atlaskit/tree';

import toast from '@lib/toast';
import { buildAppPagesTreeData } from '@lib/utils';

import { fetchPageList, fetchFormScheme, formDataCurd, getOperate } from './api';

class UserAppDetailsStore {
  destroySetCurPage: IReactionDisposer;
  @observable appID = '';
  @observable pageID = '';
  @observable pageListLoading = true;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable pageName = '';
  @observable formScheme: ISchema | null = null;
  @observable authority = 0;
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };

  constructor() {
    this.destroySetCurPage = reaction(() => {
      if (!this.pageID || this.pageListLoading || !this.pagesTreeData.items[this.pageID]) {
        return;
      }

      return this.pagesTreeData.items[this.pageID].data;
    }, this.setCurPage);
  }

  @action
  fetchPageList = (appID: string): void => {
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
    Promise.all([
      getOperate<{ authority: number | null }>(this.appID, this.pageID),
      fetchFormScheme(this.appID, pageInfo.id),
    ]).then(([authorityRef, schemeRef]) => {
      this.authority = authorityRef?.authority || 0;
      this.pageName = pageInfo.name || '';
      this.formScheme = schemeRef.schema || null;
      this.fetchSchemeLoading = false;
    }).catch(() => {
      this.fetchSchemeLoading = false;
    });
    this.curPage = pageInfo;
  }

  @action
  delFormData = (ids: string[]) => {
    return formDataCurd(this.appID, this.pageID, {
      method: 'delete',
      conditions: { condition: [{ key: '_id', op: ids.length > 1 ? 'in' : 'eq', value: ids }] },
    }).then(() => {
      toast.success('删除成功!');
    });
  }

  @action
  clear = (): void => {
    this.formScheme = null;
    this.pageListLoading = true;
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
    this.curPage = { id: '' };
  }
}

export default new UserAppDetailsStore();
