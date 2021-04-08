import { observable, action } from 'mobx';

import { departmentToTreeNode } from '@lib/utils';
import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

class AppPagesStore {
  rootStore: any;
  constructor(rootStore: any) {
    this.rootStore = rootStore;
  }

  @observable treeStore: TreeStore<any> | null = null;
  @observable curPage = {};

  @action
  deletePage = (node: TreeNode<any>) => {
    this.treeStore?.deleteNode(node);
  }

  @action
  addPage = (pageInfo) => {
    if (pageInfo.id) {
      this.treeStore?.updateNode(pageInfo);
    } else {
      this.treeStore?.addChildren('164e5fa7-43fb-40b9-96b0-1788f170cfac', [{
        children: [],
        childrenStatus: 'resolved',
        data: { id: '39e09c5b-4b04-48a7-8218-41b39ac02ea4', departmentName: '部门4123', useStatus: 1, pid: '164e5fa7-43fb-40b9-96b0-1788f170cfac', grade: 2 },
        expanded: true,
        id: '39e09c5b-4b04-48a7-8218-41b39ac02ea4',
        isLeaf: true,
        level: 2,
        name: '发送到发送',
        order: 0,
        parentId: '164e5fa7-43fb-40b9-96b0-1788f170cfac',
        path: '',
        visible: true,
      }]);
    }
  }

  @action
  fetchPages = () => {
    const data: any = {
      departmentName: 'qingcloudddd',
      departmentLeaderID: '0fe5f11a-3a5b-4218-80c9-a3579e4e843b',
      useStatus: 1,
      grade: 1,
      child: [
        {
          id: '39e09c5b-4b04-48a7-8218-41b39ac02ea4',
          departmentName: '部门4123', useStatus: 1, pid: '164e5fa7-43fb-40b9-96b0-1788f170cfac', grade: 2, child: null,
        },
        {
          id: 'e3875731-da0a-48e1-ad99-e172b93c1366',
          departmentName: '部门1111', useStatus: 1, pid: '164e5fa7-43fb-40b9-96b0-1788f170cfac', grade: 2, child: [{
            id: '123123123123',
            departmentName: '测试部门123', useStatus: 1, pid: 'e3875731-da0a-48e1-ad99-e172b93c1366', grade: 3, child: null,
          }],
        },
        {
          id: '9416317a-d7f4-47c0-903f-9d5848d10617',
          departmentName: '测试部门', useStatus: 1, pid: '164e5fa7-43fb-40b9-96b0-1788f170cfac', grade: 2, child: null,
        },
        {
          id: '5e23125d-21d6-45b6-ba60-d325c4d5b5c3',
          departmentName: '全象1', useStatus: 1, pid: '164e5fa7-43fb-40b9-96b0-1788f170cfac', grade: 2, child: null,
        },
        {
          id: '9aebdd63-5dbc-4eb1-952f-68dd526c9a52',
          departmentName: 'qxp-dev', useStatus: 1, pid: '164e5fa7-43fb-40b9-96b0-1788f170cfac', grade: 2,
        }],
    };
    this.treeStore = new TreeStore({ rootNode: departmentToTreeNode(data) });
  }

  @action
  setCurPage = (pageInfo) => {
    this.curPage = pageInfo;
  }
}

export default AppPagesStore;
