import {
  Position, XYPosition, isNode, Elements, isEdge,
} from 'react-flow-renderer';
import { update } from 'lodash';

import { deepClone } from '@lib/utils';

export * from './branch';
export * from './node';
export * from './edge';
import { CurrentElement } from '../type';

export interface GetCenterParams {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
}
const LeftOrRight = [Position.Left, Position.Right];
export const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: GetCenterParams): [number, number, number, number] => {
  const sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition);
  const targetIsLeftOrRight = LeftOrRight.includes(targetPosition);

  const mixedEdge = (sourceIsLeftOrRight && !targetIsLeftOrRight) ||
    (targetIsLeftOrRight && !sourceIsLeftOrRight);

  if (mixedEdge) {
    const xOffset = sourceIsLeftOrRight ? Math.abs(targetX - sourceX) : 0;
    const centerX = sourceX > targetX ? sourceX - xOffset : sourceX + xOffset;

    const yOffset = sourceIsLeftOrRight ? 0 : Math.abs(targetY - sourceY);
    const centerY = sourceY < targetY ? sourceY + yOffset : sourceY - yOffset;

    return [centerX, centerY, xOffset, yOffset];
  }

  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
};

export function mergeDataAdapter<T, S>(
  originalData: S,
  path: string,
  updater: (v: T) => T,
): S {
  const newData = deepClone(originalData);
  update(newData, path, updater);
  return newData as S;
}

export function getCenterPosition(position: XYPosition, width: number, height: number): XYPosition {
  return { x: position.x - (width / 2), y: position.y - (height / 2) };
}

export function removeEdge(eles: Elements, source: string, target: string): Elements {
  return eles.filter((el) => {
    return isNode(el) || (isEdge(el) && (el.source !== source || el.target !== target));
  });
}

export function getBranchTargetElementID(
  sourceElement: CurrentElement,
  targetElement: CurrentElement,
): string | undefined {
  if (targetElement.type === 'processBranchTarget') {
    return targetElement.id;
  }
  if (targetElement.type === 'processBranchSource') {
    return targetElement.data.nodeData.parentBranchTargetElementID;
  }
  return sourceElement.data.nodeData.branchTargetElementID ||
    targetElement.data.nodeData.branchTargetElementID;
}
