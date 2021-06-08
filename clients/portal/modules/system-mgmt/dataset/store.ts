import { observable, action, computed, toJS } from 'mobx';

import toast from '@lib/toast';
import * as apis from './api';

class DatasetStore {
  @observable names: DatasetName[] = [];
  @observable search = '';
  @observable loadingNames = false;
  @observable loadingDataset = false;
  @observable activeId = '';
  @observable activeDataset: Dataset | null = null;

  @computed get dataList() {
    const dataset = toJS(this.activeDataset);
    if (!dataset) {
      return [];
    }
    let dataList;

    try {
      dataList = JSON.parse(dataset.content || '[]');
    } catch (err) {
      dataList = [];
    }

    return dataList;
  }

  @action
  fetchAllNames = async (params?: Record<string, string>) => {
    this.loadingNames = true;
    try {
      const { list } = await apis.getDatasetNames(params);
      this.names = list;
    } catch (err) {
      toast.error(err.message);
    }
    this.loadingNames = false;
  };

  @action
  fetchDataset = async (id: string) => {
    this.loadingDataset = true;
    try {
      this.activeDataset = await apis.getDatasetById(id);
    } catch (err) {
      toast.error(err.message);
    }
    this.loadingDataset = false;
  }

  @action
  setNames = (names: DatasetName[]) => {
    this.names = names;
  };

  @action
  setSearch = (word: string) => {
    this.search = word;
  };

  @action
  setActive = (id: string) => {
    if (!id && this.names.length) {
      this.activeId = this.names[0].id;
    } else {
      this.activeId = id;
    }
  }

  @action
  setActiveDataset = (dataset: Dataset | null) => {
    this.activeDataset = dataset;
  }

  @action
  reset = () => {
    this.search = '';
    this.names = [];
    this.activeId = '';
    this.activeDataset = null;
  }
}

export default new DatasetStore();
