/* eslint-disable max-len */
import { XYPosition, Node, FlowElement, removeElements, isNode, Elements } from 'react-flow-renderer';
import { cloneDeep, set } from 'lodash';

import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { uuid } from '@lib/utils';
import {
  getInitFieldPermissionFromSchema,
} from '@flow/content/editor/forms/intermidiate/components/field-permission/util';

import { buildBranchNodes, getBranchTargetElementID, getBranchID } from './branch';
import type { NodeType, Data, Operation, BusinessData } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from './constants';
import store, { getNodeElementById, getFormDataElement, updateStore } from '../store';
import { getCenterPosition, removeEdge } from '.';
import { edgeBuilder } from './edge';

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

function getNodeInitialData(type: NodeType): BusinessData {
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
    FORM_TIME: {
      timer: '',
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
    webhook: {
      type: 'request',
      config: {
        api: { value: '' },
        method: '',
        url: '',
        inputs: [],
        outputs: [],
      },
    },
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

function getBranchNodes(branchID: string, elements: FlowElement<Data>[]): FlowElement<Data>[] {
  return elements.filter((ele) => {
    return ele.data?.nodeData.branchID === branchID;
  });
}

function branchSourceChildIdFilter(id: string): boolean {
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
  // const _removedElements = removeElements([elementToRemove], newElements);
  // const _filterElements = _removedElements.map((item: any)=> {
  //   const sourceElement: any = _removedElements.find(({ id })=> id === item?.data?.nodeData?.parentID?.[0]);
  //   const targetElement: any = _removedElements.find(({ id })=> id === item?.data?.nodeData?.childrenID?.[0]);
  //   const branchID = getBranchID(sourceElement, targetElement);
  //   const branchTargetElementID = getBranchTargetElementID(sourceElement, targetElement);
  //   if (!branchID || !branchTargetElementID) {
  //     delete item?.data?.nodeData?.branchID;
  //     delete item?.data?.nodeData?.branchTargetElementID;
  //   }
  //   return item;
  // });

  // const temp = _filterElements.map((item: any)=>{
  //   const sourceElement: any = _filterElements.find(({ id })=> id === item?.data?.nodeData?.parentID?.[0]);
  //   if (item?.data?.nodeData?.branchID && _filterElements.findIndex((n)=>n.id === item?.data?.nodeData?.branchID) === -1) {
  //     const { data: { nodeData } } = sourceElement;
  //     item.data.nodeData = {
  //       ...item.data.nodeData,
  //       branchID: nodeData?.branchID,
  //       branchTargetElementID: nodeData?.branchTargetElementID,
  //     };
  //   }
  //   return {
  //     ...item,
  //   };
  // });

  return removeElements([elementToRemove], newElements);
}

function updateParentAndChildNodeElementRelationship(
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
    const isParentElement = nodeData?.childrenID?.includes(elementToRemove?.id);
    const isChildrenElement = elementToRemove?.data?.nodeData.childrenID?.includes(element.id);

    const isProcessBranchSource = element.type === 'processBranchSource';
    const childrenCount = nodeData?.childrenID?.filter(branchSourceChildIdFilter)?.length;
    const isProcessBranchSourceOnlyOneChildLeft = childrenCount === 1;
    const lastBranchElementNeedRemove = childrenCount === 2;
    if (isParentElement && isProcessBranchSource) {
      if (lastBranchElementNeedRemove) {
        lastBranchElementID = nodeData?.childrenID?.filter(branchSourceChildIdFilter)?.find((id) => {
          return id !== elementToRemove?.id;
        });
      }
      if (isProcessBranchSourceOnlyOneChildLeft) {
        branchToRemove.source = element;
      }
    }

    if (isParentElement && nodeData?.childrenID) {
      nodeData.childrenID = [...new Set([...nodeData.childrenID, ...(childrenID || [])])] as string[];
      nodeData.childrenID = nodeData.childrenID.filter((id) => id !== elementToRemove?.id);
    }
    if (isChildrenElement && nodeData?.parentID) {
      nodeData.parentID = [...new Set([...nodeData.parentID, ...(parentID || [])])] as string[];
      nodeData.parentID = nodeData.parentID.filter((id) => id !== elementToRemove?.id);
    }
    return element;
  });

  if (branchToRemove.source) {
    const branchToRemoveTargetID = branchToRemove.source.data?.nodeData.branchTargetElementID;
    const branchToRemoveTarget = newElements.find((element) => {
      return element.id === branchToRemoveTargetID;
    }) as FlowElement<Data>;
    removedElementsID.push(branchToRemove.source.id, branchToRemoveTarget?.id);
    newElements = onRemoveNode((branchToRemove.source as FlowElement<Data>).id, newElements);
    newElements = onRemoveNode((branchToRemoveTarget as FlowElement<Data>).id, newElements);
  } else if (elementToRemove?.type === 'processBranch' && !isRemoveLastBranch) {
    const branchNodes = getBranchNodes(elementToRemove?.id, newElements);
    branchNodes.forEach((node) => {
      removedElementsID.push(node.id);
      newElements = onRemoveNode(node.id, newElements);
    });
  }

  if (lastBranchElementID) {
    const nodeEle: any = newElements.find((item)=>item.id === lastBranchElementID) || {};
    const parentId = nodeEle?.data?.nodeData?.parentID?.[0];
    const processBranchSourceEle: any = newElements.find((item)=>item.id === parentId) || {};
    const childrenIdLength = processBranchSourceEle?.data?.nodeData?.childrenID?.length;
    if (childrenIdLength === 1) {
      removedElementsID.push(lastBranchElementID);
      newElements = onRemoveNode(lastBranchElementID, newElements, true);
    }
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
  const schema = await getFormFieldSchema({ queryKey: [undefined, tableID, appID], meta: undefined });
  if (schema && ['approve', 'fillIn'].includes(newNode.type || '')) {
    set(newNode, 'data.businessData.fieldPermission', getInitFieldPermissionFromSchema(schema));
  }
}

interface NodeInfo {
  nodeType: NodeType;
  nodeName: string;
  source: string;
  target: string;
  position: XYPosition;
  width: number;
  height: number;
}
export async function addNewNode(elements: Elements, appID: string, info: NodeInfo): Promise<void> {
  const { nodeType, source, target, position, width, height, nodeName } = info;
  const id = nodeType + uuid();
  const newElements: Elements = [...elements];
  const sourceElement = newElements.find(({ id }) => id === source) as Node<Data>;
  const targetElement = newElements.find(({ id }) => id === target) as Node<Data>;
  let sourceChildrenID = id;
  let targetParentID = id;
  if (nodeType === 'processBranch') {
    const { elements: nodes, sourceID, targetID } = buildBranchNodes(source, target, position, width, height);
    sourceChildrenID = sourceID;
    targetParentID = targetID;
    newElements.push(...nodes);
  } else {
    const sourceElement = getNodeElementById(source);
    const targetElement = getNodeElementById(target);
    const branchTargetElementID = getBranchTargetElementID(sourceElement, targetElement);
    const newNode = nodeBuilder(id, nodeType, nodeName, {
      width,
      height,
      parentID: [source],
      childrenID: [target],
      branchID: getBranchID(sourceElement, targetElement),
      position: getCenterPosition(position, width, height),
      branchTargetElementID,
    });
    await prepareNodeData(newNode, {
      tableID: getFormDataElement()?.data?.businessData?.form?.value,
      appID,
    });
    newElements.push(newNode);
    newElements.push(...edgeBuilder(source, id));
    newElements.push(...edgeBuilder(id, target));
  }
  if (sourceElement.data?.nodeData.childrenID) {
    sourceElement.data.nodeData.childrenID = [
      ...sourceElement.data.nodeData.childrenID.filter((id) => id !== target),
      sourceChildrenID,
    ];
  }
  if (targetElement.data?.nodeData?.parentID) {
    targetElement.data.nodeData.parentID = [
      ...targetElement.data.nodeData.parentID.filter((id) => id !== source),
      targetParentID,
    ];
  }
  updateStore((s) => ({ ...s, elements: removeEdge(newElements, source, target), currentConnection: {} }));
}
