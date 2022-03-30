import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { delFormDataRequest } from '@lib/http-client';
import { getOperate } from './api';

class UserAppDetailsStore {
  @observable appID = '';
  @observable appName = '';
  @observable tableID = '';
  @observable tableName = '';
  @observable fetchSchemeLoading = true;
  @observable authority = 0;
  @observable operationType = '';

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setTableName = (name: string): void => {
    this.tableName = name;
  };

  @action
  setTableID = (pageID: string): void => {
    this.tableID = pageID;
  };

  @action
  delFormData = (ids: string[]): Promise<void> => {
    return delFormDataRequest(this.appID, this.tableID, ids).then((data: any) => {
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
  getAuthority = (): void => {
    this.fetchSchemeLoading = true;
    getOperate<{ authority: number | null }>(this.appID, this.tableID).then((authorityRef) => {
      this.authority = authorityRef?.authority || 0;
    }).finally(() => {
      this.fetchSchemeLoading = false;
    });
  };
}
export default new UserAppDetailsStore();
