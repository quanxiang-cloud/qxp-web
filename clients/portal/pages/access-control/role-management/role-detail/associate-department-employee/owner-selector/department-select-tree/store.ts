import SelectableTreeStore from '@portal/components/headless-tree/multiple-select-tree';
import { TreeNode } from '@c/headless-tree/types';

export function departmentToTreeNode(department: IDepartment): TreeNode<IDepartment> {
  const children = (department.child || []).map((dep) => departmentToTreeNode(dep));

  return {
    data: department,
    name: department.departmentName,
    id: department.id,
    parentId: department.pid,
    path: '',
    isLeaf: !department.child?.length,
    visible: true,
    childrenStatus: 'resolved',
    expanded: true,
    order: 0,
    level: department.grade,
    children: children,
  };
}

export default class extends SelectableTreeStore<IDepartment> {
  constructor(rootDep: IDepartment) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
