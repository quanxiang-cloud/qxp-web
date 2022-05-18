import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Node } from '@one-for-all/artery';
import { fromJS, setIn } from 'immutable';
import {
  insertBefore,
  insertAfter,
  findNodeByID,
  getNodeParentIDs,
  deleteByID,
  keyPathById,
  _insertChildAt,
} from '@one-for-all/artery-utils';

import OutlineRender from './outline-render';
import { useComponents } from '../../fountainhead/store';
import { OutLineContext, OutLineContextState } from './context';
import { beforeIs, afterIs, firstChildIs, canHasCurChildren, getReRealNodeId } from '../utils';

import './index.scss';

export type MoveLocationType = 'inner' | 'before' | 'after';

type Props = {
  rootNode: Node;
  activeNode?: Node;
  setActiveNode?: (node?: Node) => void;
  onChange?: (node: Node) => void;
};

export default function Outline({ rootNode, activeNode, onChange, setActiveNode }: Props): JSX.Element {
  const components = useComponents();

  async function moveToById(
    sourceId: string,
    targetId: string,
    location: MoveLocationType,
  ): Promise<boolean> {
    const _sourceId = getReRealNodeId(rootNode, sourceId, true);
    if (!_sourceId) return false;

    const sourceNode = findNodeByID(rootNode, _sourceId);

    const immutableNode = fromJS(rootNode);

    if (!sourceNode) return false;

    let newNode: Node | undefined;
    if (location === 'inner' && (await canHasCurChildren(rootNode, targetId, _sourceId))) {
      if (firstChildIs(immutableNode, targetId, _sourceId)) return false;
      newNode = _insertChildAt(fromJS(deleteByID(rootNode, _sourceId)), targetId, 0, sourceNode)?.toJS() as any;

      if (!newNode) return false;
      onChange?.(newNode);
      return true;
    }

    const _targetId = getReRealNodeId(rootNode, targetId);
    const targetParentId = _targetId && getNodeParentIDs(rootNode, _targetId)?.pop();

    if (targetParentId && (await canHasCurChildren(rootNode, targetParentId, _sourceId))) {
      if (location === 'before') {
        if (beforeIs(immutableNode, _targetId, _sourceId)) return false;
        newNode = insertBefore(deleteByID(rootNode, _sourceId), _targetId, sourceNode);
      } else {
        if (afterIs(immutableNode, _targetId, _sourceId)) return false;
        newNode = insertAfter(deleteByID(rootNode, _sourceId), _targetId, sourceNode);
      }
    }

    if (!newNode) return false;
    onChange?.(newNode);
    return true;
  }

  function modifiedNodeName(updNode: Node, nodeName: string): void {
    if (updNode.label === nodeName) return;

    const immutableNode = fromJS(rootNode);
    const keyPath = keyPathById(immutableNode, updNode.id);
    if (!keyPath) return;

    const newNode = setIn(immutableNode, keyPath.concat(['label']), nodeName).toJS();

    onChange?.(newNode);
  }

  const contextValue: OutLineContextState = {
    moveToById,
    modifiedNodeName,
    setActiveNode,
    components,
    rootNodeId: rootNode.id,
    activeNodeId: activeNode?.id,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <OutLineContext.Provider value={contextValue}>
        <OutlineRender rootNode={rootNode} />
      </OutLineContext.Provider>
    </DndProvider>
  );
}
