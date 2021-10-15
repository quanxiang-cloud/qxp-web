import _ from 'lodash';
import { observable, action, computed } from 'mobx';
import logger from '@lib/logger';

import { TreeNode } from './types';

import {
  flatTree,
  findNode,
  addChildren,
  defaultGetChildren,
  getNodeParents,
  updateNode,
  patchAllNodes,
} from './utils';

const TREE_NODE_HEIGHT = 56;

export type TreeStoreProps<T> = {
  rootNode: TreeNode<T>;
  onGetChildren?: (parentNode: TreeNode<T>) => Promise<TreeNode<T>[]>;
  singleMode?: boolean;
  disableExpandNodeOnSelect?: boolean;
}

export default class TreeStore<T> {
  static ID_FOR_NODE_UNSUBMITTED = 'ID_FOR_NODE_UNSUBMITTED';

  @observable rootNode: TreeNode<T>;
  @observable currentFocusedNodeID = '';
  @observable renamingNodeID = '';
  @observable draggingNode: TreeNode<T> | null = null;
  @observable autoSelect?: boolean;
  @observable disableExpandNodeOnSelect?: boolean;

  onGetChildren: (parentNode: TreeNode<T>) => Promise<TreeNode<T>[]> = defaultGetChildren;

  constructor({
    rootNode, onGetChildren, disableExpandNodeOnSelect,
  }: TreeStoreProps<T>, autoSelect?: boolean) {
    this.rootNode = rootNode;
    this.autoSelect = autoSelect !== false;
    this.disableExpandNodeOnSelect = disableExpandNodeOnSelect;
    if (autoSelect) {
      this.currentFocusedNodeID = rootNode.id;
    }

    if (onGetChildren) {
      this.onGetChildren = onGetChildren;
    }
  }

  @computed get currentFocusedNode(): TreeNode<T> | any {
    const node = this.nodeList.find(({ id }) => {
      return id === this.currentFocusedNodeID;
    });

    if (!this.autoSelect) {
      return node || {};
    }
    return node || this.rootNode;
  }

  @computed get actualFocusedNodeID(): string {
    if (this.currentFocusedNode.visible) {
      return this.currentFocusedNode.id;
    }

    return (this.getNodeParents(this.currentFocusedNode.id).reverse().find(({ expanded }) => {
      return !expanded;
    }) || this.currentFocusedNode).id;
  }

  @computed get nodeList(): TreeNode<T>[] {
    const nodeList = flatTree(this.rootNode);

    let expandLevel = Number.MAX_VALUE;
    let invisibleNodeCount = 0;

    return nodeList.map((node, index) => {
      if (node.level > expandLevel) {
        invisibleNodeCount = invisibleNodeCount + 1;

        return {
          ...node,
          visible: false,
          positionY: (index - invisibleNodeCount) * TREE_NODE_HEIGHT,
        };
      }

      if (node.level === expandLevel) {
        expandLevel = Number.MAX_VALUE;
      }

      if (!node.expanded) {
        expandLevel = node.level;
      }

      return { ...node, positionY: (index - invisibleNodeCount) * TREE_NODE_HEIGHT };
    });
  }

  @computed get scrollHeight(): number {
    return this.nodeList.filter(({ visible }) => visible).length * TREE_NODE_HEIGHT;
  }

  @action
  setDraggingNode(node: TreeNode<T> | null): void {
    this.draggingNode = node;
  }

  @action
  setRoot(rootNode: TreeNode<T>): void {
    this.rootNode = rootNode;
  }

  @action
  setRenamingNode(nodeID: string): void {
    if (!nodeID) {
      this.renamingNodeID = nodeID;
      return;
    }

    if (this.getNode(nodeID)) {
      this.renamingNodeID = nodeID;
    }
  }

  getNode(nodeID: string): TreeNode<T> | null {
    return findNode(this.rootNode, nodeID);
  }

  getNodeParents(nodeID: string): TreeNode<T>[] {
    const node = this.getNode(nodeID);

    if (!node) {
      return [];
    }
    const path: TreeNode<T>[] = [];

    if (getNodeParents(this.rootNode, nodeID, path)) {
      path.push(this.rootNode);
      return path.slice(1);
    }

    return [];
  }

  hasNameConflict(newName: string, nodeID: string): boolean {
    const node = this.getNode(nodeID);
    if (!node) return false;

    const parentNode = this.getNode(node.parentId as string);
    if (!parentNode) return false;

    return parentNode.children?.filter(({ id, isLeaf }): boolean => {
      return id !== node.id && isLeaf === node.isLeaf;
    }).some(({ name }): boolean => name === newName) || false;
  }

  @action
  patchNode(
    nodeID: string,
    name: string,
    data: Record<string, string | number | boolean | undefined | null | Array<string | number>>,
  ): boolean {
    const nodeToPatch = this.getNode(nodeID);
    if (!nodeToPatch) {
      return false;
    }

    this.updateNode({
      ...nodeToPatch,
      name,
      data: _.merge(nodeToPatch.data, data),
    });

    return true;
  }

  // todo change param to nodeID
  @action
  deleteNode(node: TreeNode<T>, autoFocused = true): boolean {
    const parentNode = this.getNode(node.parentId as string);

    if (!parentNode) {
      logger.error('failed to delete node, because cannot find its parent node');
      return false;
    }

    let deletedAt = 0;

    const _parentNode = { ...parentNode };

    _parentNode.children = (parentNode.children || []).filter(({ id }, index) => {
      if (id !== node.id) {
        return true;
      }

      deletedAt = index;
      return false;
    });

    this.updateNode(_parentNode);

    if (!autoFocused) {
      return true;
    }

    const focusedIndex = Math.min(deletedAt, _parentNode.children.length - 1);

    if (focusedIndex !== -1) {
      this.currentFocusedNodeID = _parentNode.children[focusedIndex].id;
    } else {
      this.currentFocusedNodeID = parentNode.id;
    }

    return true;
  }

  @action
  addChildren(parentID: string, nodes: TreeNode<T>[]): boolean {
    const parentNode = this.getNode(parentID);

    if (!parentNode) {
      return false;
    }

    this.updateNode(addChildren(parentNode, nodes));
    return true;
  }

  @action
  updateNode(node: TreeNode<T>): void {
    this.rootNode = updateNode(this.rootNode, node);
  }

  @action
  expandNode(node: TreeNode<T>): void {
    if (node.isLeaf) {
      return;
    }

    const _node = {
      ...node,
      expanded: true,
    };

    this.updateNode(_node);

    if (node.childrenStatus === 'unknown') {
      this.loadChildren(_node);
    }
  }

  @action
  collapseNode(node: TreeNode<T>): void {
    if (node.isLeaf) {
      return;
    }

    this.updateNode({
      ...node,
      expanded: false,
    });
  }

  @action
  collapseAll(): void {
    if (!this.rootNode.children) {
      return;
    }

    this.rootNode = {
      ...this.rootNode,
      children: this.rootNode.children.map((child) => {
        return patchAllNodes(child, { expanded: false });
      }),
    };
  }

  @action
  expandAll(): void {
    if (!this.rootNode.children) {
      return;
    }

    this.rootNode = {
      ...this.rootNode,
      children: this.rootNode.children.map((child) => {
        return patchAllNodes(child, { expanded: true });
      }),
    };
  }

  @action
  onSelectNode(nodeID: string): void {
    this.currentFocusedNodeID = nodeID;

    if (this.currentFocusedNode.isLeaf) {
      return;
    }

    // expand non leaf node for better user experience
    !this.disableExpandNodeOnSelect && this.expandNode(this.currentFocusedNode);
  }

  @action
  async loadChildren(node: TreeNode<T>, isOverwrite = false): Promise<void> {
    this.updateNode({
      ...node,
      childrenStatus: 'loading',
    });

    const _node = this.getNode(node.id);
    if (!_node) {
      return;
    }
    const subNodes = await this.onGetChildren(node);
    this.updateNode({
      ...addChildren(_node, subNodes, isOverwrite),
      childrenStatus: 'resolved',
    });
  }
}
