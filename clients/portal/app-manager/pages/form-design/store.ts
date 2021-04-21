import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';

import FormStore from '@c/form-builder/store';
import notify from '@lib/notify';
import {
  createFormScheme,
  fetchFormScheme,
  updateFormScheme,
  createPageScheme,
} from '@appLib/api';

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer
  @observable pageID = '';
  @observable pageLoading = true;
  @observable formStore: any = null;
  @observable formMetadata: any = {};
  @observable pageConfig = null;
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

  @computed get fieldList(): PageField[] {
    const fieldsMap = this.formStore?.schema?.properties || {};
    return Object.keys(fieldsMap).map((key: string) => {
      return {
        id: key,
        placeholder: '搜索关键字...',
        label: fieldsMap[key].title || '',
        type: fieldsMap[key]['x-component'],
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
  fetchFormScheme = (pageID: string) => {
    if (!pageID) {
      return;
    }
    this.pageLoading = true;
    fetchFormScheme(pageID).then((res) => {
      const { schema = {}, config, ...others } = res.data || {};
      this.formStore = new FormStore({ schema });
      this.formMetadata = others;
      this.pageConfig = config;
      this.pageLoading = false;
    }).catch(()=>{
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
