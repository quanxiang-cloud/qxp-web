import * as React from 'react';
import classnames from 'classnames';
import { Icon } from '@QCFE/lego-ui';

type Props<T> = {
  node: TreeNode<T>;
  draggingNode: TreeNode<T> | null;
  currentFocusedNodeID: string;
  renamingNodeID: string;
  actualFocusedNodeID: string;
  upwardFocusedStyleToParent: boolean;
  nodeRender: (node: TreeNode<T>) => JSX.Element | string;
  onClick: (node: TreeNode<T>) => void;
  onSwitcherClick: (node: TreeNode<T>) => void;
  draggable?: (node: TreeNode<T>) => boolean;
  canDropOn?: (node: TreeNode<T>) => boolean;
  onDragOver?: (node: TreeNode<T>, draggingNode: TreeNode<T>) => boolean;
  onDrop: (node: TreeNode<T>) => void;
  setDraggingNode?: (node: TreeNode<T> | null) => void;
}

function renderSwitcherIcon({
  childrenStatus,
  expanded,
  onClick,
}: Pick<TreeNode<any>, 'childrenStatus' | 'expanded'> & { onClick: () => void }): JSX.Element {
  if (childrenStatus === 'loading') {
    return (<Icon name="loading" size={20} />);
  }

  return (
    <Icon
      name="caret-down"
      size={16}
      className={classnames('tree-node__toggle-icon', {
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
  currentFocusedNodeID,
  renamingNodeID,
  actualFocusedNodeID,
  upwardFocusedStyleToParent,
  nodeRender,
  onClick,
  onSwitcherClick,
  draggingNode,
  draggable,
  setDraggingNode,
  canDropOn,
  onDragOver,
  onDrop,
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

  return (
    <div
      key={node.id}
      style={{ transform: `translateY(${node.positionY}px)`, zIndex: 100 - node.level }}
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
      className={classnames('tree-node', {
        'tree-node--focused': node.id === currentFocusedNodeID && !upwardFocusedStyleToParent,
        'tree-node--focused-on-parent': bubbledFocusedStyle,
        'tree-node--fade': renamingNodeID && node.id !== renamingNodeID,
        'tree-node--accept-drop': isAcceptDrop,
      })}
    >
      {Array.from(Array(node.level - 1)).map(function(_, i) {
        // todo refactor this after get catalog by access_sys_id available
        return <span key={i} className="tree-node__indent-placeholder" />;
      })}
      {
        !node.isLeaf ? renderSwitcherIcon({
          childrenStatus: node.childrenStatus,
          expanded: node.expanded,
          onClick: () => onSwitcherClick(node),
        }) : null
      }
      <div
        className="tree-node__content"
        style={{ width: `calc(100% - ${36 * (node.level - 1)}px)` }}
        draggable={draggable?.(node)}
        onDragStart={(): void => setDraggingNode?.(node)}
        onDragEnd={(): void => setDraggingNode?.(null)}
      >
        {nodeRender(node)}
      </div>
    </div>
  );
}
