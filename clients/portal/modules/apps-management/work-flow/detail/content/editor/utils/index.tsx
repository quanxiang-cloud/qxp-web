import { Position, ArrowHeadType, XYPosition, Edge, Node } from 'react-flow-renderer';
import { update } from 'lodash';

import { isNode, Elements, isEdge } from 'react-flow-renderer';

import { deepClone } from '@lib/utils';

import type { NodeType, Data } from '../type';

export * from './branch';

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
      type: 'person',
      users: [],
      departments: [],
      positions: [],
      fields: [],
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
export function getNodeInitialData(type: NodeType): any {
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
    processBranch: {
      ignore: false,
      rule: '',
    },
    processVariableAssignment: {
      assignmentRules: [],
    },
    tableDataCreate: {
      targetTableId: '',
      silent: true,
      createRule: {},
      ref: {},
    },
    tableDataUpdate: {
      targetTableId: '',
      silent: true,
      filterRule: '',
      updateRule: [],
    },
    processBranchSource: {
      processBranchEndStrategy: '',
    },
    processBranchTarget: {},
    cc: {},
    sendEmail: {},
    webMessage: {},
    end: {},
  };
  if (type === 'fillIn' || type === 'approve') {
    dataMap[type].operatorPermission.system = [{
      enabled: true,
      changeable: false,
      name: '通过',
      text: '通过',
      value: 'AGREE',
      only: 'approve',
    }, {
      enabled: true,
      changeable: false,
      name: '拒绝',
      text: '拒绝',
      value: 'REFUSE',
      only: 'approve',
    }, {
      enabled: true,
      changeable: false,
      name: '提交',
      text: '提交',
      value: 'FILL_IN',
      only: 'fillIn',
    }].filter(({ only }) => only === type);
  }
  return dataMap[type];
}

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

export function nodeBuilder(
  id: string,
  type: NodeType,
  name: string,
  options: {
    position?: XYPosition;
    width?: number;
    height?: number;
    parentID?: string[];
    childrenID?: string[];
    branchTargetElementID?: string;
    branchID?: string;
  }): Node<Data> {
  return {
    id, type, data: {
      type: type as 'fillIn',
      nodeData: {
        width: options.width as number || 200,
        height: options.height as number || 72,
        name,
        ...(options.parentID ? { parentID: options.parentID } : {}),
        ...(options.childrenID ? { childrenID: options.childrenID } : {}),
        ...(options.branchID ? { branchID: options.branchID } : {}),
        ...(options.branchTargetElementID ? {
          branchTargetElementID: options.branchTargetElementID,
        } : {}),
      },
      businessData: getNodeInitialData(type),
    },
    position: options.position as XYPosition || { x: 0, y: 0 },
  };
}

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
    return isNode(el) || (isEdge(el) && (el.source != source || el.target != target));
  });
}
