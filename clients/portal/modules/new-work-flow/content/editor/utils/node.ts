/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
import { XYPosition, Node, FlowElement, removeElements, isNode, Elements } from 'react-flow-renderer';
import { cloneDeep, set } from 'lodash';

import { getFormFieldSchema } from '@newFlow/content/editor/forms/api';
import { uuid } from '@lib/utils';
import {
  getInitFieldPermissionFromSchema,
} from '@newFlow/content/editor/forms/intermidiate/components/field-permission/util';

import { buildBranchNodes, getBranchTargetElementID, getBranchID } from './branch';
import type { NodeType, Data, Operation, BusinessData } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from './constants';
import store, { getNodeElementById, getFormDataElement, updateStore } from '../store';
import { getCenterPosition, removeEdge } from '.';
import { edgeBuilder } from './edge';
import { getElementParents } from '../forms/webhook/utils';

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
    tableDataQuery: {
      targetTableId: '',
      silent: true,
      createRule: {},
      ref: {},
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

function getBranchNode(branchID: string, elements: FlowElement<Data>[]): FlowElement<Data>[] {
  return elements.filter((ele) => {
    return ele.data?.nodeData.branchID === branchID;
  });
}

function branchSourceChildIdFilter(id: string): boolean { // 过滤出分 processBranch 分支节点
  return id.startsWith('processBranch') && !id.startsWith('processBranchSource') &&
      !id.startsWith('processBranchTarget');
}

type BranchToRemove = {
  source?: FlowElement<Data>;
}
// TODO:
export function onRemoveNode(
  nodeID: string, elements: FlowElement<Data>[], isRemoveLastBranch?: boolean,
): FlowElement<Data>[] {
  let newElements: FlowElement<Data>[] = cloneDeep(elements);
  const elementToRemove = newElements.find((element) => element.id === nodeID) as FlowElement<Data>;

  let { parentID, childrenID } = elementToRemove?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
  parentID = parentID?.filter((id) => {
    const element = elements.find((el) => el.id === id); // 获取节点数据
    return element?.type !== 'formData' || Number(element.data?.nodeData.childrenID?.length) <= 1; // 过滤掉formData 和 分流节点
  });
  childrenID = childrenID?.filter((id) => {
    const element = elements.find((el) => el.id === id); // 获取节点数据
    return element?.type !== 'end' || Number(element.data?.nodeData.parentID?.length) <= 1; // 过滤掉end 和 合流节点
  });

  if (!isRemoveLastBranch && parentID?.length === 1 && parentID[0].startsWith('processBranchSource') &&
        childrenID?.length === 1 && childrenID[0].startsWith('processBranchTarget')) {
    // 不是最后一个分支 && parentID只有一个还是分流节点 && childrenID只有一个还是合流节点
    parentID = parentID?.filter((id) => !id.startsWith('processBranchSource')); // 过滤掉分流节点
    childrenID = childrenID?.filter((id) => !id.startsWith('processBranchTarget')); // 过滤掉合流节点
  }
  newElements = updateParentAndChildNodeElementRelationship(
    newElements, elementToRemove, parentID, childrenID, isRemoveLastBranch,
  ); // 更新节点之间的关系

  return removeElements([elementToRemove], newElements);
}

function getAllDescendants(nodeId: any, data: any) {
  const descendants: any = [];
  function findDescendants(nodeId: any) {
    const node = data.find((item: any) => item.id === nodeId);
    if (node) {
      descendants.push(node);
      if (node.data.nodeData.childrenID) {
        node.data.nodeData.childrenID.forEach((childId: any) => {
          findDescendants(childId);
        });
      }
    }
  }
  findDescendants(nodeId);
  return descendants;
}

export function onNewRemoveNode(nodeID: string, elements: FlowElement<Data>[]) {
  let newElements: any = cloneDeep(elements);
  const removeNode: any = newElements.find((element: any) => element.id === nodeID) as FlowElement<Data>;
  const { parentID, childrenID } = removeNode?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
  const branchTargetElementID = removeNode?.data?.nodeData?.branchTargetElementID;
  const type = removeNode?.type;
  if (type !== 'processBranch') {
    newElements = updateRemoveElementsRelationship(removeNode, newElements, parentID, childrenID);
  } else {
    const branchTargetElement = newElements.find((element: any) => element.id === branchTargetElementID);
    const branchTargetElementParents = getElementParents(branchTargetElement);
    const nodeId = removeNode?.id; // 你要查找的节点的 ID
    const descendants = getAllDescendants(nodeId, elements);
    const deleteArr: any = [];
    const deleteObj: any = {};
    descendants?.forEach((item: any)=>{
      if (branchTargetElementParents?.includes(item?.id)) {
        if (!deleteObj?.[item?.id]) {
          deleteArr.push(item);
          deleteObj[item.id] = 1;
        }
      }
    });
    try {
      deleteArr.forEach((item: any, index: any)=>{
        if (index > 0) {
          const _newElementToRemove = newElements?.find((newItem: any)=>newItem?.id === item.id);
          const { parentID, childrenID } = _newElementToRemove?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
          newElements = updateRemoveBranchElementsRelationship(_newElementToRemove, newElements, parentID, childrenID); // 删除非分支节点
          newElements = updateRemoveProcessBranchElementsRelationship(_newElementToRemove, newElements, parentID, childrenID); // 删除 分支 节点
          newElements = updateRemoveProcessElementsRelationship(_newElementToRemove, newElements, parentID, childrenID); // 删除 分流 合流 节点
        }
      });
      // 删除 父 筛选节点
      deleteArr.forEach((item: any, index: any)=>{
        if (index === 0) {
          const _newElementToRemove = newElements?.find((newItem: any)=>newItem?.id === item.id);
          newElements = updateRemoveRootBranchElementsRelationship(_newElementToRemove, newElements); // 删除非分支节点
        }
      });
      const { delSingleElements, delSingleArr } = updateRemoveSingleBranchElementRelationship(newElements); // 删除单个分支节点
      newElements = delSingleElements;
      newElements = updateRemoveNoChildSourceElementRelationship(newElements); // 删除 没有分支节点的 分流  节点
      newElements = updateRemoveNoChildTargetElementRelationship(newElements); // 删除 没有分支节点的 合流 节点
      newElements = updateRemoveBranchIDElementRelationship(newElements, delSingleArr); // 更新 branchID 节点
      newElements = updateRemoveBranchTargetIDElementRelationship(newElements); // 更新  节点的 branchTargetElementID
    } catch (error) {
      console.log('error', error);
    }
  }
  return newElements;
}

function updateRemoveElementsRelationship(
  elementToRemove: FlowElement<Data>,
  elements: FlowElement<Data>[],
  parentID?: string[],
  childrenID?: string[],
) {
  let newElements: any = cloneDeep(elements);
  if (!newElements?.find((item: any)=>item?.id === elementToRemove?.id)) {
    return newElements;
  }
  newElements = newElements.map((element: any) => {
    if (!isNode(element)) { // 非节点
      const { target, source } = element || {};
      let _target: any = target;
      if (source === elementToRemove?.id) {
        return;
      }
      if (source === parentID?.[0]) {
        _target = childrenID?.[0];
      }
      return {
        ...element,
        target: _target,
      };
    }
    const curNodeData = element.data?.nodeData; // 获取当前节点的 nodeData
    const isParentElement = curNodeData?.childrenID?.includes(elementToRemove?.id); // 当前节点是否是被删节点的 父节点
    const isChildrenElement = curNodeData?.parentID?.includes(elementToRemove?.id); // 当前节点是否是被删节点的 子节点

    if (isParentElement && curNodeData?.childrenID) { // 当前节点是 被删节点的父节点 并且 当前节点有 子节点
      curNodeData.childrenID = [...new Set([...curNodeData.childrenID, ...(childrenID || [])])] as string[]; // 被删节点子节点 给当前节点 childrenID
      curNodeData.childrenID = curNodeData.childrenID.filter((id: any) => id !== elementToRemove?.id); // 当前节点 childrenID 删掉 被删节点id
    }
    if (isChildrenElement && curNodeData?.parentID) { // 当前节点是否是被删节点的 子节点 并且 当前节点有父节点
      curNodeData.parentID = [...new Set([...curNodeData.parentID, ...(parentID || [])])] as string[]; // 被删节点父节点 给当前节点 parentID
      curNodeData.parentID = curNodeData.parentID.filter((id: any) => id !== elementToRemove?.id); // 当前节点 parentID 删掉 被删节点id
    }
    return element; // 返回 更新后的 当前节点
  })?.filter((item: any)=> !!item);
  newElements = removeElements([elementToRemove], newElements);
  return newElements;
}
function updateRemoveRootElementsRelationship(
  elementToRemove: FlowElement<Data>,
  elements: FlowElement<Data>[],
) {
  let newElements: any = cloneDeep(elements);
  if (!newElements?.find((item: any)=>item?.id === elementToRemove?.id)) {
    return newElements;
  }
  newElements = newElements.map((element: any) => {
    if (!isNode(element)) { // 非节点
      return element;
    }
    const curNodeData = element.data?.nodeData; // 获取当前节点的 nodeData
    const isParentElement = curNodeData?.childrenID?.includes(elementToRemove?.id); // 当前节点是否是被删节点的 父节点
    const isChildrenElement = curNodeData?.parentID?.includes(elementToRemove?.id); // 当前节点是否是被删节点的 子节点

    if (isParentElement && curNodeData?.childrenID) { // 当前节点是 被删节点的父节点 并且 当前节点有 子节点
      curNodeData.childrenID = curNodeData.childrenID.filter((id: any) => id !== elementToRemove?.id); // 当前节点 childrenID 删掉 被删节点id
    }

    if (isChildrenElement && curNodeData?.parentID) { // 当前节点是否是被删节点的 子节点 并且 当前节点有父节点
      curNodeData.parentID = curNodeData.parentID.filter((id: any) => id !== elementToRemove?.id); // 当前节点 parentID 删掉 被删节点id
    }

    return element; // 返回 更新后的 当前节点
  })?.filter((item: any)=> !!item);
  newElements = removeElements([elementToRemove], newElements);
  return newElements;
}

// 删除非分支节点
function updateRemoveBranchElementsRelationship(
  elementToRemove: FlowElement<Data>,
  elements: FlowElement<Data>[],
  parentID?: string[],
  childrenID?: string[],
) {
  const branchArr = ['processBranch', 'processBranchSource', 'processBranchTarget'];
  let newElements: any = cloneDeep(elements);
  const type: any = elementToRemove?.type;
  if (!branchArr?.includes(type)) {
    newElements = updateRemoveElementsRelationship(elementToRemove, newElements, parentID, childrenID); // 删除非分支节点
  }
  return newElements;
}
// 删除 分支 节点
function updateRemoveProcessBranchElementsRelationship(
  elementToRemove: FlowElement<Data>,
  elements: FlowElement<Data>[],
  parentID?: string[],
  childrenID?: string[],
) {
  const branchArr = ['processBranch'];
  let newElements: any = cloneDeep(elements);
  const type: any = elementToRemove?.type;
  if (branchArr?.includes(type)) {
    newElements = updateRemoveElementsRelationship(elementToRemove, newElements, parentID, childrenID); // 删除分支节点
  }
  return newElements;
}
// 删除 分流 合流 节点
function updateRemoveProcessElementsRelationship(
  elementToRemove: FlowElement<Data>,
  elements: FlowElement<Data>[],
  parentID?: string[],
  childrenID?: string[],
) {
  const branchArr = ['processBranchSource', 'processBranchTarget'];
  let newElements: any = cloneDeep(elements);
  const type: any = elementToRemove?.type;
  if (branchArr?.includes(type)) {
    newElements = updateRemoveElementsRelationship(elementToRemove, newElements, parentID, childrenID); // 删除 分流 合流 节点
  }
  return newElements;
}
//  删除 父 筛选节点
function updateRemoveRootBranchElementsRelationship(
  elementToRemove: FlowElement<Data>,
  elements: FlowElement<Data>[],
) {
  const branchArr = ['processBranch'];
  let newElements: any = cloneDeep(elements);
  const type: any = elementToRemove?.type;
  if (branchArr?.includes(type)) {
    newElements = updateRemoveRootElementsRelationship(elementToRemove, newElements); // 删除分支节点
  }
  return newElements;
}
// 删除 单个 分支 节点
function updateRemoveSingleBranchElementRelationship(elements: any) {
  let newElements = cloneDeep(elements);
  const branchArr = ['processBranch'];
  const delArr = newElements?.filter((item: any)=>{
    const type: any = item?.type;
    let flag = false;
    if (item?.data?.nodeData?.parentID?.length === 1 && branchArr?.includes(type)) {
      const parentNode = newElements?.find((node: any)=>{
        return node?.id === item?.data?.nodeData?.parentID?.[0];
      });
      if (parentNode?.data?.nodeData?.childrenID?.length === 1) {
        flag = true;
      }
    }
    return flag;
  });
  delArr.forEach((item: any)=>{
    const { parentID, childrenID } = item?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
    newElements = updateRemoveProcessBranchElementsRelationship(item, newElements, parentID, childrenID);
  });
  return { delSingleElements: newElements, delSingleArr: delArr };
}
// 删除 没有 子节点 的 分流节点
function updateRemoveNoChildSourceElementRelationship(elements: any) {
  let newElements = cloneDeep(elements);
  const branchArr = ['processBranchSource'];
  const delArr = newElements?.filter((item: any)=>{
    const type: any = item?.type;
    let flag = false;
    const { childrenID } = item?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
    if (childrenID?.length < 2 && branchArr?.includes(type)) {
      flag = true;
    }
    return flag;
  });
  delArr.forEach((item: any)=>{
    const { parentID, childrenID } = item?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
    newElements = updateRemoveElementsRelationship(item, newElements, parentID, childrenID);
  });
  return newElements;
}
// 删除 没有 父节点 的 合流节点
function updateRemoveNoChildTargetElementRelationship(elements: any) {
  let newElements = cloneDeep(elements);
  const branchArr = ['processBranchTarget'];
  const delArr = newElements?.filter((item: any)=>{
    const type: any = item?.type;
    let flag = false;
    const { parentID } = item?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
    if (parentID?.length < 2 && branchArr?.includes(type)) {
      flag = true;
    }
    return flag;
  });
  delArr.forEach((item: any)=>{
    const { parentID, childrenID } = item?.data?.nodeData || {}; // 获取被删除节点的 parentID childrenID
    newElements = updateRemoveElementsRelationship(item, newElements, parentID, childrenID);
  });
  return newElements;
}

// 更新 节点 branchID
function updateRemoveBranchIDElementRelationship(elements: any, delSingleArr: any) {
  const newElements = cloneDeep(elements);
  newElements?.forEach((item: any)=>{
    if (isNode(item)) {
      const nodeData = item?.data?.nodeData;
      const { branchID } = nodeData || {};
      if (branchID === delSingleArr?.[0]?.id && !delSingleArr?.[0]?.data?.nodeData?.branchID) {// 主分支下的分支节点
        nodeData.branchID = '';
      }
      if (branchID === delSingleArr?.[0]?.id && delSingleArr?.[0]?.data?.nodeData?.branchID) { // 子分支下的分支节点
        nodeData.branchID = delSingleArr?.[0]?.data?.nodeData?.branchID;
      }
    }
  });

  return newElements;
}

function updateRemoveBranchTargetIDElementRelationship(elements: any) {
  const newElements = cloneDeep(elements);
  newElements?.forEach((item: any)=>{
    if (isNode(item)) {
      const nodeData = item?.data?.nodeData;
      const { branchID, branchTargetElementID } = nodeData || {};
      if (branchTargetElementID && !newElements?.find((item: any)=>item?.id === branchTargetElementID)) {
        nodeData.branchTargetElementID = newElements?.find((item: any)=>item?.id === branchID)?.data?.nodeData?.branchTargetElementID || '';
      }
    }
  });

  return newElements;
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
    if (!isNode(element)) { // 非节点 直接返回
      return element;
    }
    const nodeData = element.data?.nodeData; // 获取当前节点的 nodeData
    const isParentElement = nodeData?.childrenID?.includes(elementToRemove?.id); // 当前节点是否是被删节点的 父节点
    const isChildrenElement = elementToRemove?.data?.nodeData.childrenID?.includes(element.id); // 当前节点是否是被删节点的 子节点

    const isProcessBranchSource = element.type === 'processBranchSource'; // 当前节点是 分流节点
    const childrenCount = nodeData?.childrenID?.filter(branchSourceChildIdFilter)?.length; // 当前节点 分支个数
    const isProcessBranchSourceOnlyOneChildLeft = childrenCount === 1; // 当前节点 只有一个分支
    const lastBranchElementNeedRemove = childrenCount === 2; // 当前节点 有两个分支
    if (isParentElement && isProcessBranchSource) { // 当前节点是 被删节点的父节点 并且 当前节点是分流节点
      if (lastBranchElementNeedRemove) { // 当前节点 是分流节点 并且 有两个分支
        lastBranchElementID = nodeData?.childrenID?.filter(branchSourceChildIdFilter)?.find((id) => {
          return id !== elementToRemove?.id;
        }); // 当前节点 最后一个分支 id
      }
      if (isProcessBranchSourceOnlyOneChildLeft) { // 当前节点 是分流节点 并且 有一个分支
        branchToRemove.source = element; // 当前节点
      }
    }

    if (isParentElement && nodeData?.childrenID) { // 当前节点是 被删节点的父节点 并且 当前节点有 子节点
      nodeData.childrenID = [...new Set([...nodeData.childrenID, ...(childrenID || [])])] as string[]; // 被删节点子节点 给当前节点 childrenID
      nodeData.childrenID = nodeData.childrenID.filter((id) => id !== elementToRemove?.id); // 当前节点 childrenID 删掉 被删节点id
    }
    if (isChildrenElement && nodeData?.parentID) { // 当前节点是否是被删节点的 子节点 并且 当前节点有父节点
      nodeData.parentID = [...new Set([...nodeData.parentID, ...(parentID || [])])] as string[]; // 被删节点父节点 给当前节点 parentID
      nodeData.parentID = nodeData.parentID.filter((id) => id !== elementToRemove?.id); // 当前节点 parentID 删掉 被删节点id
    }
    return element; // 返回 更新后的 当前节点
  });

  if (branchToRemove.source) { // 当前节点 只有一个分支 删掉 分流 合流 节点
    const branchToRemoveTargetID = branchToRemove.source.data?.nodeData.branchTargetElementID; // 当前节点的合流节点id
    const branchToRemoveTarget = newElements.find((element) => {
      return element.id === branchToRemoveTargetID;
    }) as FlowElement<Data>; // 当前节点的合流节点
    removedElementsID.push(branchToRemove.source.id, branchToRemoveTarget?.id); // 删除当前节点 当前节点的合流节点
    newElements = onRemoveNode((branchToRemove.source as FlowElement<Data>).id, newElements);
    newElements = onRemoveNode((branchToRemoveTarget as FlowElement<Data>).id, newElements);
  } else if (elementToRemove?.type === 'processBranch' && !isRemoveLastBranch) {// 当前节点是分支节点 并且 不是最后一个分支
    const branchNodes = getBranchNode(elementToRemove?.id, newElements); // 获取分支节点下的 节点
    branchNodes.forEach((node) => { // 删除分支下的所有节点
      removedElementsID.push(node.id);
      newElements = onRemoveNode(node.id, newElements);
    });
  }

  if (lastBranchElementID) { // 当前节点 有两个分支, lastBranchElementID 是 除 被删节点外的另一个分支id
    const nodeEle: any = newElements.find((item)=>item.id === lastBranchElementID) || {}; // 另一个分支节点
    const parentId = nodeEle?.data?.nodeData?.parentID?.[0]; // 另一个分支节点的父节点id
    const processBranchSourceEle: any = newElements.find((item)=>item.id === parentId) || {}; // 另一个分支节点的父节点
    const childrenIdLength = processBranchSourceEle?.data?.nodeData?.childrenID?.length; // 另一个分支节点的父节点 child 数量
    if (childrenIdLength === 1) { // 如果有一个就 将另一个分支节点删除
      removedElementsID.push(lastBranchElementID);
      newElements = onRemoveNode(lastBranchElementID, newElements, true);
    }
  }

  return newElements.concat(
    edgeBuilder(
      parentID?.filter((id) => !removedElementsID.includes(id)), // 过滤掉被撒节点id
      childrenID?.filter((id) => !removedElementsID.includes(id)), // 过滤掉被撒节点id
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
  if (sourceElement?.data?.nodeData.childrenID) {
    sourceElement.data.nodeData.childrenID = [
      ...sourceElement.data.nodeData.childrenID.filter((id) => id !== target),
      sourceChildrenID,
    ];
  }
  if (targetElement?.data?.nodeData?.parentID) {
    targetElement.data.nodeData.parentID = [
      ...targetElement.data.nodeData.parentID.filter((id) => id !== source),
      targetParentID,
    ];
  }
  updateStore((s) => ({ ...s, elements: removeEdge(newElements, source, target), currentConnection: {} }));
}
