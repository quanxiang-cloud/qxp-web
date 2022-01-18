import { useMemo } from 'react';
import dagre from 'dagre';
import { clone, prop } from 'ramda';
import { Elements, isNode, Position, useStoreState } from 'react-flow-renderer';

import { LAYOUT_DIRECTION_MAP } from '../constants';
import useGetNodeSize from './use-get-node-size';

const { DAGRE } = LAYOUT_DIRECTION_MAP;

export default function useDagreLayout(elements: Elements = [], direction: 'right' | 'bottom'): Elements {
  const rankdir = DAGRE[direction] ?? DAGRE.nomatch;
  const nodesStates = useStoreState(prop('nodes'));
  const getNodeSizeById = useGetNodeSize(nodesStates);

  const layoutedElements = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir, ranksep: 90 });
    elements?.forEach((el) => {
      if (isNode(el)) {
        const { width, height } = getNodeSizeById(el.id);
        return dagreGraph.setNode(el.id, {
          width: el.data?.nodeData?.width ?? width,
          height: el.data?.nodeData?.height ?? height,
        });
      }
      dagreGraph.setEdge(el.source, el.target);
    });
    dagre.layout(dagreGraph);
    return elements.map((ele) => {
      const el = clone(ele);
      if (isNode(el)) {
        const { width } = getNodeSizeById(el.id);
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = Position.Top;
        el.sourcePosition = Position.Bottom;
        el.position = {
          x: nodeWithPosition.x - ((el.data?.nodeData?.width || width) / 2),
          y: nodeWithPosition.y,
        };
      }
      return el;
    });
  }, [elements.length]);

  return layoutedElements;
}
