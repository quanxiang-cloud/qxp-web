import TreeStore from '@c/headless-tree/store';
import { departmentToTreeNode } from '@lib/utils';

export default class DepartmentsStore extends TreeStore<Department> {
  constructor(rootDep: Department) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
