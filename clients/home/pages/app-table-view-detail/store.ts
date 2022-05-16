import { action, observable, reaction } from 'mobx';

import { delFormDataRequest } from '@lib/http-client';
import { getOperate } from './api';

import type { Props as TableViewsProps } from './index';
import { getButtonAPIList } from './utils';

class TableViewStore {
  @observable appID = '';
  @observable tableID = '';
  @observable tableName = '';
  @observable curRowID = '';
  @observable fetchSchemeLoading = false;
  @observable curRoleID = '';
  @observable authority: Record<string, boolean> = {};
  @observable operationType = '';

  constructor(props: TableViewsProps) {
    this.appID = props.appID;
    this.tableID = props.tableID;
    reaction(() => this.curRoleID, () => this.getAuthority(props.appID, props.tableID));
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setCurRoleID = (curRoleID: string): void => {
    this.curRoleID = curRoleID;
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
    const toolList = getButtonAPIList(appID, tableID);
    getOperate(appID, { paths: toolList }).then((authorityRef) => {
      this.authority = authorityRef || {};
    }).finally(() => {
      this.fetchSchemeLoading = false;
    });
  };
}
export default TableViewStore;
