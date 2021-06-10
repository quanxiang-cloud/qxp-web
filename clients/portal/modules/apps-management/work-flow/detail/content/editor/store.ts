import { BehaviorSubject } from 'rxjs';
import { FlowElement, Edge, isNode, Node } from 'react-flow-renderer';
import { uuid, deepClone } from '@lib/utils';
import { update } from 'lodash';
import moment from 'moment';

import { edgeBuilder, getNodeInitialData, nodeBuilder } from './utils';
import type { StoreValue, BusinessData, CurrentElement, Data, NodeType } from './type';

export const getStoreInitialData = () => {
  const startId = 'formData' + uuid();
  const endId = 'end' + uuid();
  return {
    saved: false,
    needSaveFlow: false,
    errors: {
      publish: {},
      dataNotSaveMap: new Map(),
    },
    id: '',
    name: '未命名工作流' + moment().format('YYYY-MM-DD-HH-mm-ss'),
    apiFetched: false,
    validating: false,
    version: '0.1',
    status: 'DISABLE',
    processKey: '',
    triggerMode: 'FORM_DATA',
    nodeIdForDrawerForm: '',
    currentConnection: {},
    cancelable: false,
    urgeable: false,
    seeStatusAndMsg: false,
    nodeAdminMsg: false,
    elements: [
      nodeBuilder(startId, 'formData', '工作表触发'),
      nodeBuilder(endId, 'end', '结束', {
        width: 100,
        height: 28,
      }),
      edgeBuilder(startId, endId),
    ],
  };
};

const store = new BehaviorSubject<StoreValue>(getStoreInitialData());

export function initStore() {
  store.next(getStoreInitialData());
}

type LinkedNodeType = FlowElement<Data> & {
  parents: LinkedNodeType[] | null;
  childrens: LinkedNodeType[] | null;
};
function parseNodeLinkedList(id: string) {
  const elements = deepClone(store.value.elements);
  const elementNodeMap: Record<string, LinkedNodeType> = {};
  elements.forEach((element: Node & LinkedNodeType) => {
    if (!isNode(element)) {
      return;
    }
    elementNodeMap[element.id] = element;
  });
  elements.forEach((element: Edge) => {
    if (isNode(element)) {
      return;
    }
    const { source, target } = element;
    const sourceNode = elementNodeMap[source];
    const targetNode = elementNodeMap[target];
    if (!sourceNode.parents) {
      sourceNode.parents = [];
    }
    if (!sourceNode.childrens) {
      sourceNode.childrens = [];
    }
    if (!targetNode.parents) {
      targetNode.parents = [];
    }
    if (!targetNode.childrens) {
      targetNode.childrens = [];
    }
    sourceNode.childrens.push(targetNode);
    targetNode.parents.push(sourceNode);
  });
  return elementNodeMap[id].childrens;
}

function parseChildrensIDs(linkedElements: LinkedNodeType[]) {
  const ids: string[] = [];
  linkedElements.forEach((el) => {
    ids.push(el.id);
    if (el.childrens) {
      ids.push(...parseChildrensIDs(el.childrens));
    }
  });
  return ids;
}

export function removeNodeById(id: string) {
  let sourceId;
  let targetId;
  const newElements: FlowElement[] = [];
  const { elements } = store.value;
  const linkedElements = parseNodeLinkedList(id);
  const linkedElementsIDs = parseChildrensIDs(linkedElements ?? []);
  let removedNode: Node;
  elements.forEach((el) => {
    const element = el as Edge;
    if (element.target === id) {
      sourceId = element.source;
    }
    if (element.source === id) {
      targetId = element.target;
    }
    if (id === element.id) {
      removedNode = element as unknown as Node;
    }
    if (id !== element.id && element.source !== id && element.target !== id) {
      let position = (element as unknown as Node).position;
      if (linkedElementsIDs.includes(element.id)) {
        position = { ...position, y: position.y - (removedNode.data.nodeData.height * 2) };
      }
      newElements.push({ ...element, position });
    }
  });
  if (sourceId && targetId) {
    newElements.push(edgeBuilder(sourceId, targetId));
  }
  store.next({
    ...store.value,
    elements: newElements,
  });
}

export function updateStore(updater: (st: StoreValue) => StoreValue) {
  return store.next({
    ...store.value,
    ...updater(store.value),
  });
}

export function updateStoreByKey<T>(key: keyof StoreValue, updater: (st: T) => T) {
  store.next({
    ...store.value,
    [key]: updater(store.value[key] as T),
  });
}

export function updateBusinessDataByKey<T>(
  id: string,
  fieldName: keyof BusinessData,
  updater: (v: T) => T,
) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element): FlowElement => {
      if (element.id === id && element?.data?.businessData) {
        update(element, `data.businessData.${fieldName}`, updater);
      }
      return element;
    }),
  });
}

export function updateBusinessData(
  id: string,
  updater: (v: BusinessData) => BusinessData,
  storeValue?: Partial<StoreValue>,
) {
  store.next({
    ...store.value,
    ...(storeValue ?? {}),
    elements: store.value.elements.map((element): FlowElement => {
      if (element.id === id && element?.data) {
        update(element, 'data.businessData', updater);
      }
      return element;
    }),
  });
}

export function updateNodeDataByKey<T>(elementId: string, fieldName: string, updater: (v: T) => T) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element): FlowElement => {
      if (element.id === elementId && element?.data?.nodeData) {
        update(element, `data.nodeData.${fieldName}`, updater);
      }
      return element;
    }),
  });
}

export function updateElementByKey<T>(
  elementId: string,
  fieldName: keyof FlowElement<Data> | 'position',
  updater: (v: T) => T,
) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element) => {
      if (element.id === elementId) {
        update(element, fieldName, updater);
      }
      return element;
    }),
  });
}

export function resetElementsData(
  type: NodeType,
  value: Partial<BusinessData>,
) {
  store.next({
    ...store.value,
    saved: false,
    elements: store.value.elements.map((element) => {
      if (!isNode(element) || !element.data) {
        return element;
      }
      update(element, 'data.businessData', () => {
        if (element.type === type) {
          return {
            ...getNodeInitialData(type),
            ...value,
          };
        }
        return getNodeInitialData(element.type as NodeType);
      });
      return element;
    }),
  });
}

export function getNodeElementById(id: string): CurrentElement {
  return store.value.elements.find((element) => element.id === id) as CurrentElement;
}

export function numberTransform(keys: string[], data: any) {
  keys.forEach((key) => update(data, key, (v) => +v));
  return data;
}

export function buildBpmnText(
  version: string,
  nodeID: string,
  newBusinessData: Partial<BusinessData>,
) {
  return JSON.stringify({
    version,
    shapes: store.value.elements.map((el) => {
      let data: any = el;
      if (el.id == nodeID) {
        data = {
          ...el,
          data: { ...el.data, businessData: { ...el.data?.businessData, ...newBusinessData } },
        };
      }
      if (!['approve', 'fillIn'].includes(data.type as string)) {
        return data;
      }
      return numberTransform([
        'data.businessData.basicConfig.timeRule.deadLine.day',
        'data.businessData.basicConfig.timeRule.deadLine.hours',
        'data.businessData.basicConfig.timeRule.deadLine.minutes',
        'data.businessData.basicConfig.timeRule.deadLine.urge.day',
        'data.businessData.basicConfig.timeRule.deadLine.urge.hours',
        'data.businessData.basicConfig.timeRule.deadLine.urge.minutes',
        'data.businessData.basicConfig.timeRule.deadLine.urge.repeat.day',
        'data.businessData.basicConfig.timeRule.deadLine.urge.repeat.hours',
        'data.businessData.basicConfig.timeRule.deadLine.urge.repeat.minutes',
      ], data);
    }),
  });
}

export default store;
