import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { observable, action, toJS, reaction, IReactionDisposer } from 'mobx';

import TreeStore from './store';
import RenderNode from './node';
import { SwitcherIcon, TreeNode } from './types';
import SelectableTreeStore from './multiple-select-tree';

export interface Props<T> {
  store: TreeStore<T>;
  NodeRender: React.FC<{ node: TreeNode<T>; store: TreeStore<T> | SelectableTreeStore<T> }>;
  RootNodeRender: React.FC<{ node: TreeNode<T>; store: TreeStore<T> | SelectableTreeStore<T> }>;
  nodeDraggable?: (node: TreeNode<T>) => boolean;
  canDropOn?: (node: TreeNode<T>) => boolean;
  onDragOver?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => boolean;
  onDrop?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => Promise<boolean>;
  onSelect?: (data: T) => void;
  className?: string;
  itemClassName?: string;
  switcherIcon?: SwitcherIcon;
}

@observer
export default class Tree<T> extends React.Component<Props<T>> {
  @observable isRootAcceptDrop = false;
  selectDisposer: IReactionDisposer;

  static defaultProps = {
    NodeRender: (node: TreeNode<any>): JSX.Element | string => {
      return node.name;
    },
    RootNodeRender: (node: TreeNode<any>): JSX.Element | string => {
      return node.name;
    },
  };

  constructor(props: Props<T>) {
    super(props);

    this.selectDisposer = reaction(() => this.props.store.currentFocusedNodeID, () => {
      this.props.onSelect?.(toJS(this.props.store.currentFocusedNode.data));
    });
  }

  componentDidMount(): void {
    this.props.onSelect?.(toJS(this.props.store.currentFocusedNode.data));
  }

  componentWillUnmount(): void {
    this.selectDisposer();
  }

  @action
  setAcceptDrop(acceptDrop: boolean): void {
    this.isRootAcceptDrop = acceptDrop;
  }

  // force selected node and pass it up
  handleNodeClick = (node: TreeNode<T>): void => {
    // todo check is shift key down?
    this.props.store.onSelectNode(node.id);
    this.props.onSelect?.(toJS(node.data));
  };

  handleSwitcherClick = (node: TreeNode<T>): void => {
    if (node.expanded) {
      this.props.store.collapseNode(node);
    } else {
      this.props.store.expandNode(node);
    }
  };

  handleSetDraggingNode = (node: TreeNode<T> | null): void => {
    this.props.store.setDraggingNode(node);
  };

  defaultOnDragOver = (node: TreeNode<T>, draggingNode: TreeNode<T>): boolean => {
    const parentNodes = this.props.store.getNodeParents(node.id);

    if (parentNodes.every(({ id }) => id !== draggingNode.id)) {
      return this.props.onDragOver?.(node, draggingNode) || true;
    }

    return false;
  };

  handleDrop = (dropTo: TreeNode<T>): void => {
    const draggingNode = this.props.store.draggingNode;
    if (!draggingNode) {
      return;
    }

    if (dropTo.id === draggingNode.parentId) {
      return;
    }

    this.props.onDrop?.(dropTo, draggingNode).then((flag): void => {
      if (!flag) {
        return;
      }

      this.props.store.deleteNode(draggingNode);
      this.props.store.addChildren(dropTo.id, [{
        ...draggingNode,
        parentId: dropTo.id,
      }]);
    });
  };

  render(): JSX.Element {
    const {
      NodeRender,
      RootNodeRender,
      nodeDraggable,
      canDropOn,
      className,
      itemClassName,
    } = this.props;
    const {
      nodeList,
      currentFocusedNode,
      renamingNodeID,
      actualFocusedNodeID,
      scrollHeight,
      draggingNode,
    } = this.props.store;

    if (!nodeList.length) {
      return (<div className="tree" />);
    }

    const upwardFocusedStyleToParent = currentFocusedNode.id !== actualFocusedNodeID;

    const rootNode = nodeList[0];

    return (
      <div className={cs('tree', className)}>
        {rootNode.visible && (
          <div
            key={rootNode.id}
            onClick={(): void => this.handleNodeClick(rootNode)}
            className={cs('group', 'tree-node', {
              'tree-node--focused': rootNode.id === currentFocusedNode.id,
              'tree-node--fade': renamingNodeID,
              'tree-node--accept-drop': this.isRootAcceptDrop,
            }, itemClassName)}
            onDragLeave={(): void => this.setAcceptDrop(false)}
            onDragOver={(e): void => {
              if (draggingNode?.id !== rootNode.id) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.setAcceptDrop(true);
              } else {
                this.setAcceptDrop(false);
              }
            }}
            onDrop={(): void => {
              this.handleDrop(rootNode);
              this.setAcceptDrop(false);
            }}
          >
            <div className="tree-node__content">
              <RootNodeRender node={rootNode} store={this.props.store} />
            </div>
          </div>
        )}
        {
          nodeList.slice(1).map((node) => {
            return (
              <RenderNode
                key={node.id}
                node={node}
                store={this.props.store}
                draggingNode={draggingNode}
                renamingNodeID={renamingNodeID}
                actualFocusedNodeID={actualFocusedNodeID}
                upwardFocusedStyleToParent={upwardFocusedStyleToParent}
                NodeRender={NodeRender}
                draggable={nodeDraggable}
                canDropOn={canDropOn}
                onDragOver={this.defaultOnDragOver}
                onDrop={this.handleDrop}
                setDraggingNode={this.handleSetDraggingNode}
                currentFocusedNodeID={currentFocusedNode.id}
                onClick={this.handleNodeClick}
                onSwitcherClick={this.handleSwitcherClick}
                className={itemClassName}
                switcherIcon={this.props.switcherIcon}
              />
            );
          })
        }
        <div className="tree__scroll" style={{ height: `${scrollHeight + 15}px` }} />
      </div>
    );
  }
}
