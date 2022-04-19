import { action, observable } from 'mobx';

import { delFormDataRequest } from '@lib/http-client';
import { getOperate } from './api';

import type { Props as TableViewsProps } from './index';

class TableViewStore {
  @observable appID = '';
  @observable tableID = '';
  @observable tableName = '';
  @observable curRowID = '';
  @observable fetchSchemeLoading = true;
  @observable authority = 63;
  @observable operationType = '';

  constructor(props: TableViewsProps) {
    this.appID = props.appID;
    this.tableID = props.tableID;
    // this.getAuthority(props.appID, props.tableID);
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setTableName = (name: string): void => {
    this.tableName = name;
  };

  @action
  setTableID = (tableID: string): void => {
    this.tableID = tableID;
  };

  @action
  setCurRowID = (id: string): void => {
    this.curRowID = id;
  };

  @action
  delFormData = (ids: string[]): Promise<any> => {
    return delFormDataRequest(this.appID, this.tableID, ids);
  };

  @action
  setOperationType = (type: string): void => {
    this.operationType = type;
  };

  @action
  getAuthority = (appID: string, tableID: string): void => {
    this.fetchSchemeLoading = true;
    getOperate<{ authority: number | null }>(appID, tableID).then((authorityRef) => {
      this.authority = authorityRef?.authority || 0;
    }).finally(() => {
      this.fetchSchemeLoading = false;
    });
  };
}
export default TableViewStore;
