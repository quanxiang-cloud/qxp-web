import { observable, action } from 'mobx';

import TreeStore from '@c/headless-tree/store';
import notify from '@lib/toast';
import appPageDataStore from '@appC/app-page-data/store';
import { TreeNode } from '@c/headless-tree/types';
import { getFilterField } from '../pages/form-design/utils';
import {
  fetchPageList,
  createPage,
  updatePage,
  createGroup,
  deleteGroup,
  deletePage,
  movePage,
  fetchFormScheme,
} from '@appLib/api';

function getPageDataSchema(config: any, schema: any) {
  const { pageTableShowRule = {}, pageTableConfig, filtrate=[] } = config || {};
  const { setFiltrates, setTableConfig, setTableColumns } = appPageDataStore;
  const fieldsMap = schema?.properties || {};
  const tableColumns: any[] = [];
  let recordColNum = 0;
  let fixedColumnIndex: number[] = [];
  switch (pageTableShowRule.fixedRule) {
  case 'one':
    fixedColumnIndex = [0];
    break;
  case 'previous_two':
    fixedColumnIndex = [0, 1];
    break;
  }

  Object.keys(fieldsMap).forEach((key: string) => {
    const hasVisible = pageTableConfig ? 'visible' in pageTableConfig[key] : false;
    if ((hasVisible && pageTableConfig[key].visible) || !hasVisible) {
      tableColumns.push({
        id: key,
        Header: fieldsMap[key].title || '',
        accessor: key,
        fixed: fixedColumnIndex.includes(recordColNum),
      });
      recordColNum += 1;
    }
  });

  if (pageTableConfig) {
    tableColumns.sort((a, b) => {
      return pageTableConfig[b.id].sort - pageTableConfig[a.id].sort;
    });
  }

  setFiltrates(filtrate.map((field: PageField) => {
    return getFilterField(field);
  }));
  setTableColumns(tableColumns);
  setTableConfig(pageTableShowRule);
}

function getTreeData(pageList: any[], root: any, level = 1) {
  const treeList = pageList.map((pageData) => {
    const treeData = {
      data: pageData,
      name: pageData.name || '',
      id: pageData.id || '',
      path: '',
      isLeaf: pageData.menuType === 0,
      expanded: false,
      order: pageData.sort,
      visible: true,
      childrenStatus: 'resolved',
      level: level,
      parentId: root.id,
      children: [],
    };

    if (pageData.child) {
      getTreeData(pageData.child, treeData, level + 1);
    }

    return treeData;
  });

  root.children = treeList;
}

class AppPagesStore {
  rootStore: any;
  constructor(rootStore: any) {
    this.rootStore = rootStore;
  }

  @observable treeStore: TreeStore<any> | null = null;
  @observable pageListLoading = false;
  @observable fetchSchemeLoading = false;
  @observable appId = '';
  @observable formScheme = null;
  @observable curPage = {};

  @action
  deletePageOrGroup = (node: TreeNode<any>, type: string) => {
    const data = {
      id: node.data.id,
      appID: node.data.appID,
      sort: node.data.sort,
    };

    return (type === 'delGroup' ? deleteGroup({ ...data, group_id: '' }) :
      deletePage({ ...data, group_id: node.data.groupID })).then(() => {
      this.treeStore?.deleteNode(node);
      notify.success('删除成功');
    });
  }

  @action
  editGroup = (groupInfo: GroupInfo, node: TreeNode<any>) => {
    return createGroup({ appID: this.appId, ...groupInfo }).then((res) => {
      if (groupInfo.id) {
        this.treeStore?.updateNode({
          ...node,
          name: groupInfo.name || '',
          data: { ...node.data, ...groupInfo },
        });
        notify.success('修改成功');
      } else {
        const newGroup = { ...res.data, name: groupInfo.name, menuType: 1 };
        this.treeStore?.addChildren('root', [{
          data: newGroup,
          name: newGroup.name || '',
          id: newGroup.id || '',
          path: '',
          isLeaf: false,
          expanded: false,
          order: this.treeStore.rootNode.children?.length || 1,
          visible: true,
          childrenStatus: 'resolved',
          level: 1,
          parentId: 'root',
          children: [],
        }]);
        notify.success('创建成功');
      }
    });
  }

  @action
  editPage = (pageInfo: PageInfo, node: TreeNode<any>) => {
    if (pageInfo.id) {
      return updatePage(pageInfo).then(() => {
        notify.success('修改成功');
        this.treeStore?.updateNode({
          ...node,
          name: pageInfo.name || '',
          data: { ...node.data, ...pageInfo },
        });
      });
    } else {
      return createPage({ appID: this.appId, ...pageInfo }).then((res) => {
        const newPage = { ...res.data, ...pageInfo, menuType: 0 };
        this.treeStore?.addChildren(pageInfo.groupID || 'root', [{
          data: newPage,
          name: newPage.name || '',
          id: newPage.id || '',
          path: '',
          isLeaf: true,
          expanded: false,
          order: this.treeStore.rootNode.children?.length || 1,
          visible: true,
          childrenStatus: 'resolved',
          level: 1,
          parentId: pageInfo.groupID || 'root',
          children: [],
        }]);
        notify.success('创建成功');
      });
    }
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
    if (pageInfo.id) {
      this.fetchSchemeLoading = true;
      fetchFormScheme(pageInfo.id).then((res) => {
        this.formScheme = res.data;
        const { config, schema } = res.data;
        getPageDataSchema(config, schema);
        this.fetchSchemeLoading = false;
      }).catch(() => {
        this.fetchSchemeLoading = false;
      });
    } else {
      this.formScheme = null;
    }

    this.curPage = pageInfo;
  }

  @action
  fetchPageList = (appId: string) => {
    this.appId = appId;
    this.pageListLoading = true;
    fetchPageList(appId).then((res) => {
      const treeData = {
        data: {},
        name: '',
        id: 'root',
        parentId: '',
        path: '',
        isLeaf: false,
        expanded: true,
        order: 0,
        level: 0,
        visible: true,
        childrenStatus: 'resolved',
        children: [],
      };

      getTreeData(res.data.menu, treeData);
      this.treeStore = new TreeStore({
        rootNode: (treeData) as TreeNode<any>,
      });
      this.pageListLoading = false;
    });
  }

  @action
  movePage = (moveData: any) => {
    return movePage(moveData);
  }
}

export default AppPagesStore;
