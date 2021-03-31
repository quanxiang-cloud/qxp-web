import SelectableTreeStore from '@c/headless-tree/multiple-select-tree';
import { departmentToTreeNode } from '@lib/utils';

export default class extends SelectableTreeStore<Department> {
  onChange: (prevNodes: Department[], curNodes: Department[]) => void

  constructor(
    rootDep: Department,
    onChange: (prevNodes: Department[], curNodes: Department[]) => void
  ) {
    super({ rootNode: departmentToTreeNode(rootDep) });
    this.onChange = onChange;
  }
}
