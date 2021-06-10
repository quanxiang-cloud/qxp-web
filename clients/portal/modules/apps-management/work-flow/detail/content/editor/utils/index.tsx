import { Position, ArrowHeadType, XYPosition } from 'react-flow-renderer';
import { update } from 'lodash';

import { deepClone } from '@lib/utils';

import type { NodeType } from '../type';

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

const approveAndFillInCommonData = {
  basicConfig: {
    approvePersons: {
      users: [],
      departments: [],
    },
    multiplePersonWay: '',
    whenNoPerson: '',
    autoRules: [],
    timeRule: {
      enabled: false,
      deadLine: {
        breakPoint: '',
        day: '',
        hours: '',
        minutes: '',
        urge: {
          day: '',
          hours: '',
          minutes: '',
          repeat: {
            day: '',
            hours: '',
            minutes: '',
          },
        },
      },
      whenTimeout: {
        type: '',
        value: '',
      },
    },
  },
  fieldPermission: {},
  operatorPermission: {
    custom: [],
    system: [],
  },
  events: {},
};
export function getNodeInitialData(type: NodeType) {
  const dataMap = {
    formData: {
      form: { name: '', value: '' },
      triggerWay: [],
      whenAlterFields: [],
      triggerCondition: { op: '', expr: [] },
      events: {},
    },
    approve: deepClone(approveAndFillInCommonData),
    fillIn: deepClone(approveAndFillInCommonData),
    end: {},
  };
  return dataMap[type];
}

export function edgeBuilder(startId: string, endId: string) {
  return {
    id: `e${startId}-${endId}`,
    type: 'plus',
    source: startId,
    target: endId,
    label: '+',
    arrowHeadType: ArrowHeadType.ArrowClosed,
  };
}

export function nodeBuilder(
  id: string,
  type: NodeType,
  name: string,
  options: { position?: XYPosition; width?: number; height?: number; } = {
    position: { x: 0, y: 0 },
    width: 200,
    height: 72,
  }) {
  return {
    id, type, data: {
      nodeData: { width: options.width as number, height: options.height as number, name },
      businessData: getNodeInitialData(type),
    },
    position: options.position as XYPosition,
  };
}

export function mergeDataAdapter<T, S>(
  originalData: S,
  path: string,
  updater: (v: T) => T,
) {
  const newData = deepClone(originalData);
  update(newData, path, updater);
  return newData as S;
}
