import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';

export interface Menu {
  id: string;
  appID: string;
  name: string;
  icon: string;
  sort: number;
  describe: string;
  menuType: MenuType;
  groupID: string;
  child?: Menu[];
  childCount: number;
  isHide?: boolean;
  /**
   * For app page show
   */
  applyCount?: number;
}

export interface FetchPageListResponse {
  menu?: Menu[];
  count?: number;
}
