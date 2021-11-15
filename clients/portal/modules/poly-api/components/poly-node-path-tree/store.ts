
import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';
import { observable } from 'mobx';

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
  order = 0,
): TreeNode<POLY_API.PolyNodeInput> {
  let name = '';
  if (formula.name) {
    name = formula.name;
  } else if (order - 1 >= 0) {
    name = `${order - 1}`;
  }
  const id = parentId ? `${parentId}.${name}` : name;

  const children = child?.map((polyNodeInput, index) => apiRequestFormulaTreeNode(
    polyNodeInput,
    polyNodeInput.data,
    level + 1,
    true,
    false,
    parentId ? `${parentId}.${name}` : name,
    index + 1,
  ));

  return {
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
}

export default class ApiFormulaTreeStore extends TreeStore<POLY_API.PolyNodeInput> {
  constructor(root: POLY_API.PolyNodeInput, child: POLY_API.PolyNodeInput[]) {
    super({ rootNode: apiRequestFormulaTreeNode(root, child), disableExpandNodeOnSelect: true }, true);
  }

  @observable currentNodePath = '';

  setCurrentNodePath = (path: string): void => {
    this.currentNodePath = path;
  }
}
