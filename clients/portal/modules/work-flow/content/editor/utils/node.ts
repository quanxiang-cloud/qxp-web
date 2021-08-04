import { XYPosition, Node } from 'react-flow-renderer';

import { deepClone } from '@lib/utils';

import type { NodeType, Data, Operation, FillInData } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from './constants';
import store, { getNodeElementById } from '../store';

const approveAndFillInCommonData = {
  basicConfig: {
    approvePersons: {
      type: 'person',
      users: [],
      departments: [],
    },
    multiplePersonWay: 'or',
    whenNoPerson: 'transferAdmin',
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

export function getNodeInitialData(type: NodeType): FillInData {
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
      filterRule: {},
      updateRule: [],
    },
    processBranchSource: {
      processBranchEndStrategy: '',
    },
    processBranchTarget: {},
    autocc: {
      recivers: undefined,
    },
    email: {
      content: undefined,
      mes_attachment: undefined,
      recivers: '',
      templateId: 'quanliang',
      title: '',
    },
    letter: {
      content: undefined,
      recivers: undefined,
      sort: undefined,
      title: '',
    },
    end: {},
  };
  function operatorFilter({ only }: Operation): boolean {
    return only === type;
  }
  if (type === 'fillIn' || type === 'approve') {
    dataMap[type].operatorPermission.system = SYSTEM_OPERATOR_PERMISSION.filter(operatorFilter);
    dataMap[type].operatorPermission.custom = CUSTOM_OPERATOR_PERMISSION.filter(operatorFilter);
  }
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

export function isCurrentNodeFirstLogicNode(): boolean {
  const { nodeIdForDrawerForm } = store.value;
  const currentNode = getNodeElementById(nodeIdForDrawerForm);
  const parents = currentNode?.data?.nodeData?.parentID?.map(getNodeElementById);
  return !!parents?.find((parent) => parent.type === 'formData');
}
