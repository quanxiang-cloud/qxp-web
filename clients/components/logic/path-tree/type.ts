import type { TreeNode } from '@c/headless-tree/types';
import type { CustomRule } from '@c/formula-editor';

import Store from './store';

export type API_FIELD_TYPE = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'direct_expr';
export interface TreeNodeDataType {
  type: API_FIELD_TYPE;
  name: string;
  data: TreeNodeDataType[] | string | null;
  in: 'body' | 'path' | 'header' | 'query' | '';
  required?: boolean;
  mock?: string;
  desc?: string;
  title?: string;
  id?: string;
}

export type Props = {
  value: POLY_API.PolyNodeInput[];
  onChange: (node: CurrentNode) => void;
  onRulesChange?: (rules?: CustomRule[]) => void;
  className?: string;
}

export type State = {
  root: TreeNodeDataType | null;
  treeStore: Store | null;
}

export type CurrentNode = TreeNode<TreeNodeDataType & { descPath: string }>
