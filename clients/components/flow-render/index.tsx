import React, { useEffect, useState, DragEvent } from 'react';
import dagre from 'dagre';
import ReactFlow, {
  ConnectionLineType,
  Elements,
  isNode,
  Position,
} from 'react-flow-renderer';

import useFitView from '@flow/content/editor/hooks/use-fit-view';
import { deepClone } from '@lib/utils';
import type { Data } from '@flow/content/editor/type';
import Config, { edgeTypes, nodeTypes } from '@flow/content/editor/config';

interface Props {
  elements: Elements<Data>;
  onDrop?: (e: DragEvent) => void;
  setFitViewFinished?: (finished: boolean) => void;
}

export default function FlowRender({ elements, onDrop, setFitViewFinished }: Props): JSX.Element {
  const [dagreGraph, setDagreGraph] = useState(() => new dagre.graphlib.Graph());
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 90 });
  const fitView = useFitView(() => setFitViewFinished?.(true));

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
  const layoutedElements = elements?.map((ele) => {
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
    if (!layoutedElements?.length) {
      return;
    }
    setDagreGraph(new dagre.graphlib.Graph());
  }, [layoutedElements?.length]);

  function onLoad(): void {
    setDagreGraph(new dagre.graphlib.Graph());
    setTimeout(fitView);
  }

  function onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!e.dataTransfer) {
      return;
    }
    e.dataTransfer.dropEffect = 'move';
  }

  return (
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
  );
}
