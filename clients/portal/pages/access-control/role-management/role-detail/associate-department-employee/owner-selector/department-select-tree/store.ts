import SelectableTreeStore from '@c/headless-tree/multiple-select-tree';
import { departmentToTreeNode } from '@assets/lib/utils';

export default class extends SelectableTreeStore<IDepartment> {
  onChange: (prevNodes: IDepartment[], curNodes: IDepartment[]) => void

  constructor(
    rootDep: IDepartment,
    onChange: (prevNodes: IDepartment[], curNodes: IDepartment[]) => void
  ) {
    super({ rootNode: departmentToTreeNode(rootDep) });
    this.onChange = onChange;
  }
}
