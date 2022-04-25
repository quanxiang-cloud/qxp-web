import { action, reaction, IReactionDisposer, observable } from 'mobx';

import toast from '@lib/toast';
import { getPerOption, roleChange } from '@home/lib/api';
import { treeFind, pageListToTree, NodeItem } from '@c/two-level-menu';
import { getCustomPageInfo, delFormDataRequest, fetchPageList } from '@lib/http-client';
import { CustomPageInfo, MenuType } from '@portal/modules/apps-management/pages/app-details/type';

import { getOperate } from './api';

export type PerItem = {
  roleID: string;
  roleName: string;
}

type PerRes = {
  optionPer: PerItem[];
  selectPer: PerItem;
}

class UserAppDetailsStore {
  destroySetCurPage: IReactionDisposer;
  @observable appID = '';
  @observable appName = '';
  @observable pageID = '';
  @observable pageName = '';
  @observable pageListLoading = true;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable authority = 0;
  @observable showPageNav = true;
  @observable operationType = '';
  @observable isMouseControl = false;
  @observable pageList: NodeItem<PageInfo>[] = [];
  @observable customPageInfo: CustomPageInfo | null = null;
  @observable currentRoleInfo: PerItem = { roleName: '', roleID: '' };
  @observable roleOptions: LabelValue[] = [];
  @observable appList: any = [];

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
  fetchPageList = (appID: string): Promise<any> => {
    this.appID = appID;
    this.pageListLoading = true;
    return fetchPageList(appID).then((res: any) => {
      const treeMenu = res.menu.filter(({ isHide }: PageInfo) => {
        return !isHide;
      });
      this.pageList = pageListToTree(treeMenu);
      this.pageListLoading = false;
    });
  };

  @action
  setAppList = (list: any): void => {
    this.appList = list;
  };

  @action
  setPageID = (pageID: string): void => {
    this.pageID = pageID;
  };

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

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
  };

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
  };

  @action
  clear = (): void => {
    this.pageListLoading = true;
    this.pageList = [];
    this.curPage = { id: '' };
    this.customPageInfo = null;
  };

  @action
  openPageNav = (): void => {
    this.showPageNav = true;
  };

  @action
  closePageNav = (): void => {
    this.showPageNav = false;
  };

  @action
  openMouseControl = (): void => {
    this.isMouseControl = true;
  };

  @action
  closeMouseControl = (): void => {
    this.isMouseControl = false;
  };

  @action
  getRoleInfo = (appID: string): void => {
    getPerOption<PerRes>(appID).then((res: any) => {
      const { optionPer = [], selectPer = { roleId: '', roleName: '' } } = res;
      this.currentRoleInfo = { roleName: selectPer.roleName, roleID: selectPer.roleID };
      this.roleOptions = (optionPer.map((option: PerItem) => ({
        value: option.roleID, label: option.roleName,
      })));
    }).catch((reason) => {
      toast.error(reason);
    });
  };

  @action
  handleRoleChange = (roleID: string, roleName: string): void => {
    if (!roleID || !window.APP_ID) return;
    this.currentRoleInfo = { roleName, roleID };

    roleChange(window.APP_ID, roleID).then(() => {
      toast.success(`当前角色：${roleName}`);
      this.clear();
    }).catch(toast.error);
  };
}
export default new UserAppDetailsStore();
