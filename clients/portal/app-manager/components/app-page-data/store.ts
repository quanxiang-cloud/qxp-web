import { action, observable } from 'mobx';

class AppPageDataStore {
  @observable showMoreFiltrate = false;

  @observable fieldList = [{
    type: 'text',
    label: '提交人',
    placeholder: '搜索关键字...',
    id: 'submitId',
  },
  {
    type: 'number',
    label: '转移编号',
    placeholder: '搜索关键字...',
    id: 'code',
  }, {
    type: 'select',
    label: '原使用低点',
    placeholder: '搜索关键字...',
    id: 'address',
  }, {
    type: 'date',
    label: '日期',
    placeholder: '搜索关键字...',
    id: 'date',
  }, {
    type: 'date_range',
    label: '日期范围',
    placeholder: '搜索关键字...',
    id: 'date-range',
  }];

  @observable filterList = [];

  @action
  setShowMoreFiltrate = (value:boolean) => {
    this.showMoreFiltrate = value;
  }

  @action
  setFilterList = (filterList:any) => {
    this.filterList = filterList;
  }
}

export default new AppPageDataStore();
