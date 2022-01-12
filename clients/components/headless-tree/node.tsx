import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import TreeStore from './store';
import type { SwitcherIcon, TreeNode } from './types';

type Props<T> = {
  node: TreeNode<T>;
  store: TreeStore<T>;
  draggingNode: TreeNode<T> | null;
  currentFocusedNodeID: string;
  renamingNodeID: string;
  actualFocusedNodeID: string;
  upwardFocusedStyleToParent: boolean;
  NodeRender: React.FC<{ node: TreeNode<T>; store: TreeStore<T> }>;
  onClick: (node: TreeNode<T>) => void;
  onSwitcherClick: (node: TreeNode<T>) => void;
  draggable?: (node: TreeNode<T>) => boolean;
  canDropOn?: (node: TreeNode<T>) => boolean;
  onDragOver?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => boolean;
  onDrop: (node: TreeNode<T>) => void;
  setDraggingNode?: (node: TreeNode<T> | null) => void;
  className?: string;
  switcherIcon?: SwitcherIcon;
}

type RenderSwitcherIconExtra = { onClick: () => void, switcherIcon?: SwitcherIcon };
function renderSwitcherIcon({
  childrenStatus,
  expanded,
  onClick,
  switcherIcon,
}: Pick<TreeNode<any>, 'childrenStatus' | 'expanded'> & RenderSwitcherIconExtra): JSX.Element {
  if (childrenStatus === 'loading') {
    return (<Icon name="refresh" className="animate-spin mr-4" size={16} />);
  }

  let name = 'caret-down';
  if (switcherIcon) {
    name = expanded ? switcherIcon.close : switcherIcon.open;
  }

  return (
    <Icon
      name={name}
      size={16}
      className={cs('tree-node__toggle-icon p-2', switcherIcon ? null : {
        'tree-node__toggle-icon--opened': expanded,
      })}
      onClick={(e): void => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    />
  );
}

export default function renderNode<T>({
  node,
  store,
  currentFocusedNodeID,
  renamingNodeID,
  actualFocusedNodeID,
  upwardFocusedStyleToParent,
  NodeRender,
  onClick,
  onSwitcherClick,
  draggingNode,
  draggable,
  setDraggingNode,
  canDropOn,
  onDragOver,
  onDrop,
  className,
  switcherIcon,
}: Props<T>): JSX.Element {
  const [isAcceptDrop, setAcceptDrop] = React.useState<boolean>(false);
  const _canDropOn = React.useMemo(() => canDropOn?.(node), [node]);
  const _defaultDragOver = React.useMemo<boolean>(() => {
    if (!draggingNode || !onDragOver) {
      return false;
    }

    return onDragOver(node, draggingNode);
  }, [node, draggingNode]);

  // When focused not is invisible,
  // apply focused style on the first visible parent.
  const bubbledFocusedStyle = node.id === actualFocusedNodeID && upwardFocusedStyleToParent;
  const showPlaceholder = typeof node.level === 'number' && node.level > 1;

  return (
    <div
      key={node.id}
      style={{ transform: `translateY(${node.positionY}px)`, zIndex: 100 - (node.level ?? 0) }}
      onClick={(): void => onClick(node)}
      onDragLeave={(): void => setAcceptDrop(false)}
      onDragOver={(e): void => {
        if (draggingNode?.id !== node.id && _canDropOn && _defaultDragOver) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setAcceptDrop(true);
        } else {
          setAcceptDrop(false);
        }
      }}
      onDrop={(): void => {
        onDrop(node);
        setAcceptDrop(false);
      }}
      className={cs('group', 'tree-node', className, {
        'tree-node--isLeaf': node.isLeaf,
        'tree-node--focused': node.id === currentFocusedNodeID && !upwardFocusedStyleToParent,
        'tree-node--focused-on-parent': bubbledFocusedStyle,
        'tree-node--fade': renamingNodeID && node.id !== renamingNodeID,
        'tree-node--accept-drop': isAcceptDrop,
      })}
    >
      {showPlaceholder && Array(node.level - 1).fill(0).map(function(_, i) {
        // todo refactor this after get catalog by access_sys_id available
        return <span key={i} className="tree-node__indent-placeholder" />;
      })}
      {
        !node.isLeaf ? renderSwitcherIcon({
          childrenStatus: node.childrenStatus,
          expanded: node.expanded,
          onClick: () => onSwitcherClick(node),
          switcherIcon,
        }) : null
      }
      <div
        className="tree-node__content"
        style={{ width: `calc(100% - ${36 * (node.level - 1)}px)` }}
        draggable={draggable?.(node)}
        onDragStart={(): void => setDraggingNode?.(node)}
        onDragEnd={(): void => setDraggingNode?.(null)}
      >
        <NodeRender node={node} store={store} />
      </div>
    </div>
  );
}
