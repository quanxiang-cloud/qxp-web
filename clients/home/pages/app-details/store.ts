import { action, reaction, IReactionDisposer, observable } from 'mobx';

import toast from '@lib/toast';
import { getCustomPageInfo, delFormDataRequest } from '@lib/http-client';
import { CustomPageInfo, MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { treeFind, pageListToTree, NodeItem } from '@c/two-level-menu';

import { fetchPageList, getOperate } from './api';

class UserAppDetailsStore {
  destroySetCurPage: IReactionDisposer;
  @observable appID = '';
  @observable pageID = '';
  @observable pageListLoading = true;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable pageName = '';
  @observable authority = 0;
  @observable showPageNav = true;
  @observable isMouseControl = false;
  @observable pageList: NodeItem<PageInfo>[] = [];
  @observable customPageInfo: CustomPageInfo | null = null;

  constructor() {
    this.destroySetCurPage = reaction(() => {
      if (!this.pageID || this.pageListLoading) {
        return;
      }

      const _page = treeFind(this.pageList, this.pageID);

      return _page?.source;
    }, this.setCurPage);
  }

  @action
  fetchPageList = (appID: string): void => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      const treeMenu = res.menu.filter(({ isHide }: PageInfo) => {
        return !isHide;
      });
      this.pageList = pageListToTree(treeMenu);
      this.pageListLoading = false;
    });
  }

  @action
  setPageID = (pageID: string): void => {
    this.pageID = pageID;
  }

  @action
  setCurPage = (pageInfo: PageInfo | undefined): void => {
    if (!pageInfo) {
      return;
    }

    this.curPage = pageInfo;

    if (pageInfo.menuType === MenuType.customPage) {
      getCustomPageInfo(pageInfo.appID as string, pageInfo.id).then((pageRes: CustomPageInfo) => {
        this.customPageInfo = pageRes;
      });
    } else {
      this.fetchSchemeLoading = true;
      getOperate<{ authority: number | null }>(this.appID, this.pageID).then((authorityRef) => {
        this.authority = authorityRef?.authority || 0;
        this.pageName = pageInfo.name || '';
        this.fetchSchemeLoading = false;
      }).catch(() => {
        this.fetchSchemeLoading = false;
      });
    }
  }

  @action
  delFormData = (ids: string[]): Promise<void> => {
    return delFormDataRequest(this.appID, this.pageID, ids).then((data: any) => {
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
    this.pageListLoading = true;
    this.pageList = [];
    this.curPage = { id: '' };
    this.customPageInfo = null;
  }

  @action
  openPageNav = (): void => {
    this.showPageNav = true;
  }

  @action
  closePageNav = (): void => {
    this.showPageNav = false;
  }

  @action
  openMouseControl = (): void => {
    this.isMouseControl = true;
  }

  @action
  closeMouseControl = (): void => {
    this.isMouseControl = false;
  }
}

export default new UserAppDetailsStore();
