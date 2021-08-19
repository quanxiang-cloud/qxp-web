import { flattenDeep, isString, isArray, isEmpty } from 'lodash';
import {
  ArrowHeadType, Edge, XYPosition, Position,
} from 'react-flow-renderer';

import { getNodeElementById } from '../store';
import { Data } from '../type';

export function edgeBuilder<T extends string | string[]>(
  startID?: T,
  endID?: T,
  type = 'plus',
  label = '+',
): Edge<Data>[] {
  const idIsStringWithValue = (): boolean => !![startID, endID].every((id) => isString(id) && !isEmpty(id));
  if (idIsStringWithValue()) {
    return [{
      id: `e${startID}-${endID}`,
      type,
      source: startID as string,
      target: endID as string,
      label,
      arrowHeadType: ArrowHeadType.ArrowClosed,
    }];
  }

  if (isArray(startID) && isArray(endID)) {
    const edges = startID.map((sID) => {
      return endID.map((eID) => edgeBuilder(sID, eID, type, label));
    });
    return flattenDeep(edges);
  }

  return [];
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
