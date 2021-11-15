
import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

export type Formula = {
  id: string;
  name: string;
  title?: string;
  type?: string;
  parent: string;
  subCount: number;
}

function apiRequestFormulaTreeNode(
  formula: POLY_API.PolyNodeInput,
  child: POLY_API.PolyNodeInput[] = [],
  level = 1,
  visible = false,
  expanded = true,
  parentId = '',
  parentDescPath = '',
  order = 0,
): TreeNode<POLY_API.PolyNodeInput> {
  let name = '';
  let desc = '';
  if (formula.desc) {
    desc = formula.desc;
  }
  if (formula.name) {
    name = formula.name;
  } else if (order - 1 >= 0) {
    name = `${order - 1}`;
  }
  if (!desc) {
    desc = name;
  }
  const id = parentId ? `${parentId}.${name}` : name;
  const descPath = parentDescPath ? `${parentDescPath}.${desc}` : desc;

  const children = child?.filter(Boolean).map((polyNodeInput, index) => apiRequestFormulaTreeNode(
    polyNodeInput,
    polyNodeInput.data,
    level + 1,
    true,
    false,
    id,
    descPath,
    index + 1,
  ));

  const treeNode: TreeNode<POLY_API.PolyNodeInput> = {
    data: formula,
    name,
    id,
    path: id,
    parentId: parentId || '',
    isLeaf: !child.length,
    visible: visible,
    childrenStatus: 'unknown',
    expanded,
    order,
    level,
    children,
  };

  Object.assign(treeNode.data, {
    descPath: descPath.replace(/\s/g, ''),
  });

  return treeNode;
}

export default class ApiFormulaTreeStore extends TreeStore<POLY_API.PolyNodeInput> {
  constructor(root: POLY_API.PolyNodeInput, child: POLY_API.PolyNodeInput[]) {
    super({ rootNode: apiRequestFormulaTreeNode(root, child), disableExpandNodeOnSelect: true }, true);
  }
}
