import { action, observable, reaction, IReactionDisposer } from 'mobx';

import toast from '@lib/toast';

import { fetchDataModels } from './api';

class AppModelStore {
  fetchDataModelDisposer: IReactionDisposer
  constructor() {
    this.fetchDataModelDisposer = reaction(() => this.params, this.fetchDataModels);
  }

  @observable appID = '';
  @observable dataModels: DataModel[] = [];
  @observable dataModelsLoading = true;
  @observable dataModelTotal = 0;
  @observable params: DataModelParams = {
    page: 1,
    size: 10,
    title: '',
  }

  @action
  setParams = (newParams: DataModelParams): void => {
    this.params = { ...this.params, ...newParams };
  }

  @action
  fetchDataModels = (): void => {
    if (!this.appID) {
      return;
    }

    this.dataModelsLoading = true;
    fetchDataModels(this.appID, this.params).then((res) => {
      const { total = 0, list = [] } = res || {};
      this.dataModelTotal = total;
      this.dataModels = list;
      this.dataModelsLoading = false;
    }).catch((err) => {
      this.dataModelsLoading = false;
      toast.error(err);
    });
  }
}

export default new AppModelStore();
