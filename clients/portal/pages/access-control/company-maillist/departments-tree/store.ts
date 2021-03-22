import TreeStore from '@portal/components/headless-tree/store';
import { departmentToTreeNode } from '@assets/lib/utils';

export default class DepartmentsStore extends TreeStore<IDepartment> {
  constructor(rootDep: IDepartment) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
