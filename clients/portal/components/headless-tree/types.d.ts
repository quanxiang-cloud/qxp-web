import SelectableTreeStore from './multiple-select-tree';
import TreeStore from './store';

export type TreeNode<T> = Readonly<{
  data: T;

  name: string;
  id: string;
  parentId: string | null;
  path: string;

  isLeaf: boolean;
  expanded: boolean;
  order: number;
  level: number;
  visible: boolean;
  positionY?: number;
  childrenStatus: 'resolved' | 'unknown' | 'loading';

  children?: TreeNode<T>[];
}>;

export type CheckStatus = 'checked' | 'unchecked' | 'indeterminate';

export type TNode<T> = {
  data: T;
  id: string;
  parentID: string | null;
  children?: string[];

  checkStatus: CheckStatus;
}

export type NodeRenderProps<T> = {
  node: TreeNode<T>; store: TreeStore<T> | SelectableTreeStore<T>
};
export type NodeRender<T> = React.FC<NodeRenderProps<T>>
