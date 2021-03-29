import TreeStore from '@c/headless-tree/store';
import { departmentToTreeNode } from '@assets/lib/utils';

export default class extends TreeStore<IDepartment> {
  constructor(rootDep: IDepartment) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
