import { action, observable } from 'mobx';

class PublishFormStore {
  rootStore: any;
  constructor(rootStore: any) {
    this.rootStore = rootStore;
  }
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
    {
      id: 2,
      title: '提交并管理本人数据',
      desc: '在此分组内的部门和员工可以填报数据、管理自己填报的数据。',
      users: [{ name: '谭杰 ' }],
      dep: [{ name: '质量保障部' }],
    },
    {
      id: 3,
      title: '提交并管理本人数据',
      desc: '在此分组内的部门和员工可以填报数据、管理自己填报的数据。',
      users: [{ name: '谭杰 ' }],
      dep: [{ name: '质量保障部' }],
    },
    {
      id: 4,
      title: '提交并管理本人数据',
      desc: '在此分组内的部门和员工可以填报数据、管理自己填报的数据。',
      users: [{ name: '谭杰 ' }],
      dep: [{ name: '质量保障部' }],
    },
    {
      id: 5,
      title: '提交并管理本人数据',
      desc: '在此分组内的部门和员工可以填报数据、管理自己填报的数据。',
      users: [],
      dep: [],
    },
  ];

  @action
  deleteRight = (_id: number) => {
    this.rightList = this.rightList.filter(({ id }) => id !== _id);
  }
}

export default PublishFormStore;
