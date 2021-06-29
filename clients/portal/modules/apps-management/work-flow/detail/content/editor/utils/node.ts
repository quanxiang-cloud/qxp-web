import { XYPosition, Node } from 'react-flow-renderer';

import { deepClone } from '@lib/utils';

import type { NodeType, Data } from '../type';

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
    autocc: {},
    email: {},
    letter: {},
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
    },
    {
      enabled: true,
      changeable: false,
      name: '拒绝',
      text: '拒绝',
      value: 'REFUSE',
      only: 'approve',
    },
    {
      enabled: true,
      changeable: false,
      name: '提交',
      text: '提交',
      value: 'FILL_IN',
      only: 'fillIn',
    }].filter(({ only }) => only === type);
  }
  // @ts-ignore
  return dataMap[type];
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
    parentBranchTargetElementID?: string;
    branchID?: string;
  },
): Node<Data> {
  return {
    id,
    type,
    data: {
      type: type as 'fillIn',
      nodeData: {
        width: options.width as number || 200,
        height: options.height as number || 72,
        name,
        ...(options.parentID ? { parentID: options.parentID } : {}),
        ...(options.childrenID ? { childrenID: options.childrenID } : {}),
        ...(options.branchID ? { branchID: options.branchID } : {}),
        ...(options.parentBranchTargetElementID ? {
          parentBranchTargetElementID: options.parentBranchTargetElementID } : {}),
        ...(options.branchTargetElementID ? {
          branchTargetElementID: options.branchTargetElementID,
        } : {}),
      },
      businessData: getNodeInitialData(type),
    },
    position: options.position as XYPosition || { x: 0, y: 0 },
  };
}

