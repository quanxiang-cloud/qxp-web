import {
  ArrowHeadType, Edge,
} from 'react-flow-renderer';

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
