import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';

import FormStore from '@c/form-builder/store';
import notify from '@lib/notify';
import {
  createFormScheme,
  fetchFormScheme,
  updateFormScheme,
  createPageScheme,
} from '@appLib/api';

function getAttribute(config: any, index: number) {
  if (!config) {
    return {
      visible: true,
      sort: index,
    };
  }

  return {
    visible: 'visible' in config ? config.visible : true,
    sort: 'sort' in config ? config.sort : index,
  };
}

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer
  @observable pageID = '';
  @observable pageLoading = true;
  @observable formStore: any = null;
  @observable formMetadata: any = {};
  @observable pageConfig: any = {};
  @observable rightList = [
    {
      id: 1,
      title: '提交并管理本人数据',
      desc: '在此分组内的部门和员工可以填报数据、管理自己填报的数据。',
      users: [{ name: '谭杰' }],
      dep: [{ name: '质量保障部' }],
    },
  ];

  @observable allFiltrate = [];

  @computed get tableColumn(): any[] {
    const column: any[] = [];
    [...this.fieldList].sort((a, b) => a.sort - b.sort).forEach((field) => {
      if (field.visible) {
        column.push({
          id: field.id,
          Header: field.label,
          accessor: field.id,
        });
      }
    });
    return column;
  }

  @computed get fieldList(): PageField[] {
    const fieldsMap = this.formStore?.schema?.properties || {};
    return Object.keys(fieldsMap).map((key: string, index: number) => {
      return {
        id: key,
        placeholder: '搜索关键字...',
        label: fieldsMap[key].title || '',
        type: fieldsMap[key].type,
        ...getAttribute(this.pageConfig[key], index),
      };
    });
  }

  @computed get filtrates(): any[] {
    return this.allFiltrate.filter(({ id }) => {
      return this.fieldList.findIndex((field: PageField) => field.id === id) > -1;
    });
  }

  constructor() {
    this.destroyFetchScheme = reaction(() => this.pageID, this.fetchFormScheme);
  }

  @action
  setFilterList = (list) => {
    this.allFiltrate = list;
    console.log('list: ', list);
  }

  @action
  addRight = (right) => {
    this.rightList = [right, ...this.rightList];
  }

  @action
  deleteRight = (_id: number) => {
    this.rightList = this.rightList.filter(({ id }) => id !== _id);
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  setAllPageConfig = (values: any[]) => {
    values.forEach((value) => {
      this.pageConfig[value.id] = { ...this.pageConfig[value.id], ...value };
    });
  }

  @action
  setPageConfig = (key: string, newConfig: any) => {
    const _config = { [key]: { ...this.pageConfig[key], ...newConfig } };
    this.pageConfig = { ...this.pageConfig, ..._config };
  }

  @action
  fetchFormScheme = (pageID: string) => {
    if (!pageID) {
      return;
    }

    this.pageLoading = true;
    fetchFormScheme(pageID).then((res) => {
      const { schema = {}, config, ...others } = res.data || {};
      this.formStore = new FormStore({ schema });
      this.formMetadata = others;
      this.pageConfig = config || {};
      this.pageLoading = false;
    }).catch(() => {
      this.pageLoading = false;
    });
  }

  @action
  createFormScheme = () => {
    createFormScheme({ tableID: this.pageID, schema: this.formStore.schema }).then(() => {
      notify.success('创建成功!');
    });
  }

  @action
  updateFormScheme = () => {
    updateFormScheme({
      id: this.formMetadata.id,
      schema: this.formStore.schema,
      tableID: this.pageID,
    }).then(() => {
      notify.success('保存成功!');
    });
  }

  @action
  clear = () => {
    this.pageID = '';
    this.formStore = null;
  }

  @action
  createPageScheme = () => {
    createPageScheme();
  }
}

export default new FormDesignStore();
