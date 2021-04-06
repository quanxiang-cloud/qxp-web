import SelectableTreeStore from '@c/headless-tree/multiple-select-tree';
import { departmentToTreeNode } from '@lib/utils';

export default class extends SelectableTreeStore<Department> {
  constructor(rootDep: Department) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
