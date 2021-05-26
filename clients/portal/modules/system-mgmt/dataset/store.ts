import { observable, action } from 'mobx';

import toast from '@lib/toast';
import * as apis from './api';

class DatasetStore {
  @observable names: DatasetName[] = [];
  @observable search = '';
  @observable loadingNames = false;
  @observable loadingDataset = false;
  @observable activeId = '';
  @observable activeDataset: Dataset | null = null;

  @action
  fetchAllNames = async () => {
    this.loadingNames = true;
    try {
      const { list } = await apis.getDatasetNames();
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
    this.activeId = id;
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
