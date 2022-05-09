import { observable } from 'mobx';

import { TreeNode } from '@c/headless-tree/types';
import { departmentToTreeNode } from '@lib/utils';

import { getERPTree } from './api';

class DepartmentsStore {
  @observable depTreeNode: TreeNode<Department> | undefined;

  constructor() {
    this.fetchTree();
  }

  async fetchTree(): Promise<void> {
    const treeData = await getERPTree();
    this.depTreeNode = departmentToTreeNode(treeData);
  }

  findNodeById(depTreeNode: TreeNode<Department>, id: string): TreeNode<Department> | undefined {
    if (depTreeNode.data.id === id) return depTreeNode;

    const { children } = depTreeNode;
    if (!children) return;

    for (let i = 0; i < children.length; i += 1) {
      const curNode = this.findNodeById(children[i], id);
      if (curNode) return curNode;
    }
  }

  searchNodesByName(depTreeNode: TreeNode<Department>, name: string): TreeNode<Department>[] {
    const nodes: TreeNode<Department>[] = [];

    if (depTreeNode.name.match(name)) {
      nodes.push(depTreeNode);
    }

    depTreeNode.children?.forEach((dep) => {
      nodes.push(...this.searchNodesByName(dep, name));
    });

    return nodes;
  }

  filterSelf(depTreeNode: TreeNode<Department>, self: DeptInfo): TreeNode<Department> | undefined {
    if (depTreeNode.data.id === self.id) return;

    return {
      ...depTreeNode,
      children: depTreeNode.children?.filter((dep) => this.filterSelf(dep, self)),
    };
  }

  filterDepartment(depTreeNode: TreeNode<Department>): TreeNode<Department> | undefined {
    if (depTreeNode.data.attr !== 1) return;

    return {
      ...depTreeNode,
      children: depTreeNode.children?.filter((dep) => this.filterDepartment(dep)),
    };
  }
}

export default new DepartmentsStore();
