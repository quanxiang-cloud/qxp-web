import { XYPosition, Node, FlowElement, removeElements, isNode } from 'react-flow-renderer';
import { cloneDeep, set } from 'lodash';

import { getFormFieldSchema } from '@flow/content/editor/forms/api';

import type { NodeType, Data, Operation, BusinessData } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from './constants';
import store, { getNodeElementById } from '../store';
import { edgeBuilder } from './edge';
import {
  getInitFieldPermissionFromSchema,
} from '@flow/content/editor/forms/intermidiate/components/field-permission/util';

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

export function getNodeInitialData(type: NodeType): BusinessData {
  const dataMap = {
    formData: {
      form: { name: '', value: '' },
      triggerWay: [],
      whenAlterFields: [],
      triggerCondition: { op: '', expr: [] },
      events: {},
    },
    approve: cloneDeep(approveAndFillInCommonData),
    fillIn: cloneDeep(approveAndFillInCommonData),
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
      approvePersons: {
        type: 'person',
        users: [],
        departments: [],
      },
    },
    email: {
      approvePersons: {
        type: 'person',
        users: [],
        departments: [],
      },
      content: undefined,
      mes_attachment: undefined,
      templateId: 'quanliang',
      title: '',
    },
    letter: {
      approvePersons: {
        type: 'person',
        users: [],
        departments: [],
      },
      content: undefined,
      sort: undefined,
      title: '',
    },
    end: {},
  };
  function operatorFilter({ only }: Operation): boolean {
    return only === type;
  }
  if (type === 'fillIn' || type === 'approve') {
    Object.assign(dataMap[type].operatorPermission, {
      custom: CUSTOM_OPERATOR_PERMISSION.filter(operatorFilter),
      system: SYSTEM_OPERATOR_PERMISSION.filter(operatorFilter),
    });
  }
  return dataMap[type] as BusinessData;
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
      type,
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
  } as Node<Data>;
}

export function isCurrentNodeFirstLogicNode(): boolean {
  const { nodeIdForDrawerForm } = store.value;
  const currentNode = getNodeElementById(nodeIdForDrawerForm);
  const parents = currentNode?.data?.nodeData?.parentID?.map(getNodeElementById);
  return !!parents?.find((parent) => parent.type === 'formData');
}

export function getBranchNodes(branchID: string, elements: FlowElement<Data>[]): FlowElement<Data>[] {
  return elements.filter((ele) => {
    return ele.data?.nodeData.branchID === branchID;
  });
}

export function branchSourceChildIdFilter(id: string): boolean {
  return id.startsWith('processBranch') && !id.startsWith('processBranchSource') &&
      !id.startsWith('processBranchTarget');
}

type BranchToRemove = {
  source?: FlowElement<Data>;
}
export function onRemoveNode(
  nodeID: string, elements: FlowElement<Data>[], isRemoveLastBranch?: boolean,
): FlowElement<Data>[] {
  let newElements: FlowElement<Data>[] = cloneDeep(elements);
  const elementToRemove = newElements.find((element) => element.id === nodeID) as FlowElement<Data>;
  let { parentID, childrenID } = elementToRemove?.data?.nodeData || {};
  parentID = parentID?.filter((id) => {
    const element = elements.find((el) => el.id === id);
    return element?.type !== 'formData' || Number(element.data?.nodeData.childrenID?.length) <= 1;
  });
  childrenID = childrenID?.filter((id) => {
    const element = elements.find((el) => el.id === id);
    return element?.type !== 'end' || Number(element.data?.nodeData.parentID?.length) <= 1;
  });
  if (!isRemoveLastBranch && parentID?.length === 1 && parentID[0].startsWith('processBranchSource') &&
        childrenID?.length === 1 && childrenID[0].startsWith('processBranchTarget')) {
    parentID = parentID?.filter((id) => !id.startsWith('processBranchSource'));
    childrenID = childrenID?.filter((id) => !id.startsWith('processBranchTarget'));
  }
  newElements = updateParentAndChildNodeElementRelationship(
    newElements, elementToRemove, parentID, childrenID, isRemoveLastBranch,
  );
  return removeElements([elementToRemove], newElements);
}

export function updateParentAndChildNodeElementRelationship(
  elements: FlowElement<Data>[],
  elementToRemove: FlowElement<Data>,
  parentID?: string[],
  childrenID?: string[],
  isRemoveLastBranch?: boolean,
): FlowElement<Data>[] {
  const branchToRemove: BranchToRemove = {};
  let lastBranchElementID: string | undefined = undefined;
  const removedElementsID: string[] = [];

  let newElements = elements.map((element) => {
    if (!isNode(element)) {
      return element;
    }
    const nodeData = element.data?.nodeData;
    const isParentElement = nodeData?.childrenID?.includes(elementToRemove.id);
    const isChildrenElement = elementToRemove.data?.nodeData.childrenID?.includes(element.id);

    const isProcessBranchSource = element.type === 'processBranchSource';
    const childrenCount = nodeData?.childrenID?.filter(branchSourceChildIdFilter)?.length;
    const isProcessBranchSourceOnlyOneChildLeft = childrenCount === 1;
    const lastBranchElementNeedRemove = childrenCount === 2;
    if (isParentElement && isProcessBranchSource) {
      if (lastBranchElementNeedRemove) {
        lastBranchElementID = nodeData?.childrenID?.filter(branchSourceChildIdFilter)?.find((id) => {
          return id !== elementToRemove.id;
        });
      }
      if (isProcessBranchSourceOnlyOneChildLeft) {
        branchToRemove.source = element;
      }
    }

    if (isParentElement && nodeData?.childrenID) {
      nodeData.childrenID = [...new Set([...nodeData.childrenID, ...(childrenID || [])])] as string[];
      nodeData.childrenID = nodeData.childrenID.filter((id) => id !== elementToRemove.id);
    }
    if (isChildrenElement && nodeData?.parentID) {
      nodeData.parentID = [...new Set([...nodeData.parentID, ...(parentID || [])])] as string[];
      nodeData.parentID = nodeData.parentID.filter((id) => id !== elementToRemove.id);
    }
    return element;
  });

  if (branchToRemove.source) {
    const branchToRemoveTargetID = branchToRemove.source.data?.nodeData.branchTargetElementID;
    const branchToRemoveTarget = newElements.find((element) => {
      return element.id === branchToRemoveTargetID;
    }) as FlowElement<Data>;
    removedElementsID.push(branchToRemove.source.id, branchToRemoveTarget.id);
    newElements = onRemoveNode((branchToRemove.source as FlowElement<Data>).id, newElements);
    newElements = onRemoveNode((branchToRemoveTarget as FlowElement<Data>).id, newElements);
  } else if (elementToRemove.type === 'processBranch' && !isRemoveLastBranch) {
    const branchNodes = getBranchNodes(elementToRemove.id, newElements);
    branchNodes.forEach((node) => {
      removedElementsID.push(node.id);
      newElements = onRemoveNode(node.id, newElements);
    });
  }

  if (lastBranchElementID) {
    removedElementsID.push(lastBranchElementID);
    newElements = onRemoveNode(lastBranchElementID, newElements, true);
  }

  return newElements.concat(
    edgeBuilder(
      parentID?.filter((id) => !removedElementsID.includes(id)),
      childrenID?.filter((id) => !removedElementsID.includes(id)),
    ),
  );
}

export async function prepareNodeData(
  newNode: Node<Data>, options: { appID: string, tableID: string },
): Promise<void> {
  const { tableID, appID } = options;
  if (!tableID || !appID) {
    return;
  }
  const schema = await getFormFieldSchema({ queryKey: [undefined, tableID, appID] });
  if (schema && ['approve', 'fillIn'].includes(newNode.type || '')) {
    set(newNode, 'data.businessData.fieldPermission', getInitFieldPermissionFromSchema(schema));
  }
}
