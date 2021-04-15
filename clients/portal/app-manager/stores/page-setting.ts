import { action, observable } from 'mobx';

class PageSettingStore {
  rootStore: any;
  constructor(rootStore: any) {
    this.rootStore = rootStore;
  }

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

export default PageSettingStore;
