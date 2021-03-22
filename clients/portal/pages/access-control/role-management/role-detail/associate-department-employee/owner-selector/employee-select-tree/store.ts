import TreeStore from '@portal/components/headless-tree/store';
import { departmentToTreeNode } from '@assets/lib/utils';

export default class extends TreeStore<IDepartment> {
  constructor(rootDep: IDepartment) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
