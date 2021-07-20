import {
  ArrowHeadType, Edge, XYPosition, Position,
} from 'react-flow-renderer';

import { getNodeElementById } from '../store';

export function edgeBuilder(startId: string, endId: string, type = 'plus', label = '+'): Edge {
  return {
    id: `e${startId}-${endId}`,
    type,
    source: startId,
    target: endId,
    label,
    arrowHeadType: ArrowHeadType.ArrowClosed,
  };
}

export function getFixedSourcePosition(nodeID: string, position: Position): XYPosition {
  const nodeElement = getNodeElementById(nodeID);
  const x = nodeElement.position.x || 0;
  const y = nodeElement.position.y || 0;
  const { width, height } = nodeElement.data.nodeData;

  switch (position) {
  case Position.Top:
    return {
      x: x + (width / 2),
      y,
    };
  case Position.Right:
    return {
      x: x + width,
      y: y + (height / 2),
    };
  case Position.Bottom:
    return {
      x: x + (width / 2),
      y: y + height,
    };
  case Position.Left:
    return {
      x,
      y: y + (height / 2),
    };
  }
}
