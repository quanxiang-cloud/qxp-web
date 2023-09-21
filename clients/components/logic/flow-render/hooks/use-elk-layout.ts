/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import { default as ELK, ElkExtendedEdge, ElkNode, ElkLayoutArguments } from 'elkjs';
import { Elements, isNode, Node, Edge, useStoreState } from 'react-flow-renderer';
import { groupBy, prop } from 'ramda';

import toast from '@lib/toast';

import { LAYOUT_DIRECTION_MAP } from '../constants';
import useGetNodeSize, { GetNodeSizeReturn } from './use-get-node-size';

const { ELK: layoutMap } = LAYOUT_DIRECTION_MAP;

function flowNodeToElkNode(getNodeSizeById: GetNodeSizeReturn) {
  return (node: Node): ElkNode => {
    const { width, height } = getNodeSizeById(node.id);
    return {
      id: node.id,
      width: width || 0,
      height: height || 0,
      layoutOptions: {
        'org.eclipse.elk.portConstraints': 'FIXED_SIDE',
      },
    };
  };
}

function flowEdgeToElkEdge(edge: Edge): ElkExtendedEdge {
  return {
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  };
}

function getLayoutArguments(direction: 'RIGHT' | 'DOWN'): ElkLayoutArguments {
  return {
    layoutOptions: {
      'org.eclipse.elk.algorithm': 'org.eclipse.elk.layered',
      'spacing.nodeNodeBetweenLayers': '80',
      'org.eclipse.elk.spacing.nodeNode': '79',
      'elk.direction': direction,
      'org.eclipse.elk.layered.allowNonFlowPortsToSwitchSides': 'true',
      'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'org.eclipse.elk.layered.contentAlignment': 'H_LEFT',
    },
  };
}

function updateNodePositionFromNodeState(graph: ElkNode) {
  return (originalNode: Node): Node => {
    const { x = 0, y = 0 } = graph.children?.find((n) => n.id === originalNode.id) ?? {};
    return {
      ...originalNode,
      position: { x: x + (Math.random() / 1000), y },
    };
  };
}

function getElements(nodes: Node[], edges: Edge[], graph: ElkNode): Elements {
  return [...nodes.map(updateNodePositionFromNodeState(graph)), ...edges];
}

function hasNodeSize(node: Node): boolean {
  return !!node.__rf.width && !!node.__rf.height;
}

export default function useElkLayout(elements: Elements, direction: 'right' | 'bottom'): POLY_API.Element[] {
  const nodesStates = useStoreState(prop('nodes'));
  const [newGraph, setNewGraph] = useState<any>();
  const [error, setError] = useState<any>();

  const isAllNodeRendered = !!nodesStates.length && nodesStates.every(hasNodeSize);
  const elk = new ELK();
  const getNodeSizeById = useGetNodeSize(nodesStates);

  const { nodes: _nodes = [], edges: _edges = [] } = useMemo(
    () => groupBy((el) => isNode(el) ? 'nodes' : 'edges', elements), [JSON.stringify(elements).length],
  );
  const nodes = _nodes as Node[];
  const edges = _edges as Edge[];
  const elkNodes = nodes.map(flowNodeToElkNode(getNodeSizeById));
  const elkEdges = edges.map(flowEdgeToElkEdge);

  const rankdir = layoutMap[direction] ?? layoutMap.nomatch;

  // function layoutRunner(): Promise<ElkNode> {
  //   return elk.layout({ id: 'root', children: elkNodes, edges: elkEdges }, getLayoutArguments(rankdir));
  // }
  // const { value: newGraph, error } = useAsync<ElkNode>(layoutRunner, [nodes, edges, isAllNodeRendered]);

  useEffect(()=>{
    nodes?.length && elk.layout({ id: 'root', children: elkNodes, edges: elkEdges }, getLayoutArguments(rankdir))
      .then((res: any)=>{
        setNewGraph(res);
      })
      .catch((err: any)=>{
        setError(err);
      });
  }, [JSON.stringify(elkNodes), nodes, edges, isAllNodeRendered]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);
  return useMemo(() => newGraph ? getElements(nodes, edges, newGraph) : [], [newGraph]);
}
