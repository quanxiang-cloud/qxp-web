import { action, observable } from 'mobx';

import { saveFormScheme } from '@appLib/api';

class FormDesignStore {
  @observable appID = '';
  @observable pageID = '';

  @action
  setAppID = (appID: string) => {
    this.appID = appID;
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  saveFormScheme = (schema: any) => {
    saveFormScheme({ tableID: this.pageID, schema }).then((res) => {
      console.log('res: ', res);
    });
  }
}

export default new FormDesignStore();
