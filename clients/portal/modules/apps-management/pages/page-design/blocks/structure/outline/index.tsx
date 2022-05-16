import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Node } from '@one-for-all/artery';
import { fromJS } from 'immutable';
import {
  insertBefore,
  insertAfter,
  findNodeByID,
  getNodeParentIDs,
  deleteByID,
  _insertChildAt,
} from '@one-for-all/artery-utils';

import TreeNode from './tree-node';
import { useComponents } from '../../fountainhead/store';
import { OutLineContext, OutLineContextState } from './context';
import { beforeIs, afterIs, firstChildIs, canHasCurChildren, getReRealNodeId } from '../utils';

export type MoveLocationType = 'inner' | 'before' | 'after';

type Props = {
  node: Node;
  activeNode?: Node;
  setActiveNode?: (node?: Node) => void;
  onChange?: (node: Node) => void;
};

export default function Outline({ node, activeNode, onChange, setActiveNode }: Props): JSX.Element {
  const components = useComponents();

  async function moveToById(
    sourceId: string,
    targetId: string,
    location: MoveLocationType,
  ): Promise<boolean> {
    const _sourceId = getReRealNodeId(node, sourceId, true);
    if (!_sourceId) return false;

    const sourceNode = findNodeByID(node, _sourceId);

    const immutableNode = fromJS(node);

    if (!sourceNode) return false;

    let newNode: Node | undefined;
    if (location === 'inner' && (await canHasCurChildren(node, targetId, _sourceId))) {
      if (firstChildIs(immutableNode, targetId, _sourceId)) return false;
      newNode = _insertChildAt(fromJS(deleteByID(node, _sourceId)), targetId, 0, sourceNode)?.toJS() as any;

      if (!newNode) return false;
      onChange?.(newNode);
      return true;
    }

    const _targetId = getReRealNodeId(node, targetId);
    const targetParentId = _targetId && getNodeParentIDs(node, _targetId)?.pop();

    if (targetParentId && (await canHasCurChildren(node, targetParentId, _sourceId))) {
      if (location === 'before') {
        if (beforeIs(immutableNode, _targetId, _sourceId)) return false;
        newNode = insertBefore(deleteByID(node, _sourceId), _targetId, sourceNode);
      } else {
        if (afterIs(immutableNode, _targetId, _sourceId)) return false;
        newNode = insertAfter(deleteByID(node, _sourceId), _targetId, sourceNode);
      }
    }

    if (!newNode) return false;
    onChange?.(newNode);
    return true;
  }

  const contextValue: OutLineContextState = {
    moveToById,
    rootNodeId: node.id,
    activeNodeId: activeNode?.id,
    setActiveNode,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <OutLineContext.Provider value={contextValue}>
        <TreeNode node={node} components={components} />
      </OutLineContext.Provider>
    </DndProvider>
  );
}
