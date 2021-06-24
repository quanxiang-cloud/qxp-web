import React, { useState, DragEvent, useEffect } from 'react';
import dagre from 'dagre';
import cs from 'classnames';
import ReactFlow, {
  ConnectionLineType,
  isNode,
  Elements,
  XYPosition,
  Position,
  Node,
} from 'react-flow-renderer';

import { uuid } from '@lib/utils';
import useObservable from '@lib/hooks/use-observable';
import { deepClone } from '@lib/utils';

import Components from './components';
import store, { updateStore } from './store';
import type { StoreValue, NodeType, Data } from './type';
import { nodeBuilder, buildBranchNodes, edgeBuilder, getCenterPosition, removeEdge } from './utils';
import DrawerForm from './forms';
import useFitView from './hooks/use-fit-view';
import Config, { edgeTypes, nodeTypes } from './config';

import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

interface NodeInfo {
  nodeType: NodeType;
  nodeName: string;
  source: string;
  target: string;
  position: XYPosition;
  width: number;
  height: number;
}

export default function Editor(): JSX.Element {
  const { currentConnection, elements, nodeIdForDrawerForm } = useObservable<StoreValue>(store);
  const [dagreGraph, setDagreGraph] = useState(() => new dagre.graphlib.Graph());
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 90 });
  const [fitViewFinished, setFitViewFinished] = useState(false);
  const fitView = useFitView(() => setFitViewFinished(true));

  let layoutedElements = [];
  elements?.forEach((el) => {
    if (isNode(el)) {
      return dagreGraph.setNode(el.id, {
        width: el.data?.nodeData.width,
        height: el.data?.nodeData.height,
      });
    }
    dagreGraph.setEdge(el.source, el.target);
  });
  dagre.layout(dagreGraph);
  layoutedElements = elements?.map((ele) => {
    const el = deepClone(ele);
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = Position.Top;
      el.sourcePosition = Position.Bottom;
      el.position = {
        x: nodeWithPosition.x - ((el.data?.nodeData.width || 0) / 2),
        y: nodeWithPosition.y,
      };
    }
    return el;
  });

  useEffect(() => {
    layoutedElements?.length && onLoad();
  }, [layoutedElements?.length]);

  function setElements(eles: Elements): void {
    updateStore((s) => ({ ...s, elements: eles }));
  }

  function onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!e.dataTransfer) {
      return;
    }
    e.dataTransfer.dropEffect = 'move';
  }

  function getBranchID(sourceElement: Node<Data>, targetElement: Node<Data>): undefined | string {
    if (sourceElement.type === 'processBranch') {
      return sourceElement.id;
    }
    if (targetElement.type === 'processBranch') {
      return targetElement.id;
    }
    return sourceElement.data?.nodeData.branchID || targetElement.data?.nodeData.branchID;
  }

  function addNewNode({ nodeType, source, target, position, width, height, nodeName }: NodeInfo): void {
    const id = nodeType + uuid();
    const newElements: Elements = [...elements];
    const sourceElement = newElements.find(({ id }) => id === source) as Node<Data>;
    const targetElement = newElements.find(({ id }) => id === target) as Node<Data>;
    let sourceChildrenID = id;
    let targetParentID = id;
    if (nodeType === 'processBranch') {
      const {
        elements: nodes, sourceID, targetID,
      } = buildBranchNodes(source, target, position, width, height);
      sourceChildrenID = sourceID;
      targetParentID = targetID;
      newElements.push(...nodes);
    } else {
      newElements.push(nodeBuilder(id, nodeType, nodeName, {
        width,
        height,
        parentID: [source],
        childrenID: [target],
        branchID: getBranchID(sourceElement, targetElement),
        position: getCenterPosition(position, width, height),
      }));
      newElements.push(edgeBuilder(source, id));
      newElements.push(edgeBuilder(id, target));
    }
    if (sourceElement.data?.nodeData.childrenID) {
      sourceElement.data.nodeData.childrenID = [
        ...sourceElement.data.nodeData.childrenID.filter((id) => id !== target),
        sourceChildrenID,
      ];
    }
    if (targetElement.data?.nodeData.parentID) {
      targetElement.data.nodeData.parentID = [
        ...targetElement.data.nodeData.parentID.filter((id) => id !== source),
        targetParentID,
      ];
    }
    setElements(removeEdge(newElements, source, target));
  }

  function onDrop(e: DragEvent): void {
    e.preventDefault();
    if (!e?.dataTransfer) {
      return;
    }
    const { nodeType, width, height, nodeName } = JSON.parse(
      e.dataTransfer.getData('application/reactflow'),
    );
    const { source, target, position } = currentConnection;
    if (!source || !target || !position) {
      return;
    }
    addNewNode({ nodeType, width, height, nodeName, source, target, position });
    updateStore((s) => ({ ...s, currentConnection: {} }));
  }

  function onLoad(): void {
    setDagreGraph(new dagre.graphlib.Graph());
    setTimeout(fitView);
  }

  return (
    <div className={cs('w-full h-full flex-1 relative transition', {
      'opacity-0': !fitViewFinished,
    })}>
      <div className="reactflow-wrapper w-full h-full">
        <ReactFlow
          className="cursor-move"
          elements={layoutedElements}
          connectionLineType={ConnectionLineType.Step}
          onLoad={onLoad}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Config />
        </ReactFlow>
      </div>
      <Components />
      {nodeIdForDrawerForm && (
        <DrawerForm key={nodeIdForDrawerForm} />
      )}
    </div>
  );
}
