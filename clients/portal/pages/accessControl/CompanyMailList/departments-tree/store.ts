import TreeStore from '@portal/components/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

export function departmentToTreeNode(department: Department): TreeNode<Department> {
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

export default class DepartmentsStore extends TreeStore<Department> {
  constructor(rootDep: Department) {
    super({ rootNode: departmentToTreeNode(rootDep) });
  }
}
