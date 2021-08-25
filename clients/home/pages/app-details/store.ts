import { action, reaction, IReactionDisposer, observable } from 'mobx';
import { TreeData } from '@atlaskit/tree';

import toast from '@lib/toast';
import { buildAppPagesTreeData } from '@lib/utils';
import { getTableInfo } from '@lib/http-client';
import { CustomPageInfo, MenuType } from '@portal/modules/apps-management/pages/app-details/type';

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
  @observable customPageInfo: CustomPageInfo | null = null;

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

    this.curPage = pageInfo;

    if (pageInfo.menuType === MenuType.customPage) {
      getTableInfo(pageInfo.appID as string, pageInfo.id).then((pageRes: CustomPageInfo) => {
        this.customPageInfo = pageRes;
      });
    } else {
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
    }
  }

  @action
  delFormData = (ids: string[]): Promise<void> => {
    return formDataCurd(this.appID, this.pageID, {
      method: 'delete',
      conditions: { condition: [{ key: '_id', op: ids.length > 1 ? 'in' : 'eq', value: ids }] },
    }).then((data: any) => {
      if (data.errorCount && data.errorCount === ids.length) {
        toast.error('删除失败！没有权限');
        return;
      }

      if (data.errorCount) {
        toast.success(`删除成功!,成功${ids.length - data.errorCount}条,失败${data.errorCount}条`);
        return;
      }

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
    this.customPageInfo = null;
  }
}

export default new UserAppDetailsStore();
