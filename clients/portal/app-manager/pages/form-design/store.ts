import { action, observable, reaction, IReactionDisposer } from 'mobx';

import FormStore from '@c/form-builder/store';
import notify from '@lib/notify';
import { createFormScheme, fetchFormScheme, updateFormScheme, createPageScheme } from '@appLib/api';

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer
  @observable pageID = '';
  @observable formStore: any = null;
  @observable formMetadata: any = null;

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

  @observable rightList = [
    {
      id: 1,
      title: '提交并管理本人数据',
      desc: '在此分组内的部门和员工可以填报数据、管理自己填报的数据。',
      users: [{ name: '谭杰 ' }],
      dep: [{ name: '质量保障部' }],
    },
  ];

  constructor() {
    this.destroyFetchScheme = reaction(() => this.pageID, this.fetchFormScheme);
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

    fetchFormScheme(pageID).then((res) => {
      const { schema = {}, ...others } = res.data || {};
      this.formStore = new FormStore({ schema });
      this.formMetadata = others;
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
    createPageScheme()
  }
}

export default new FormDesignStore();
