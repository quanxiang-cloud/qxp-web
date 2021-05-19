import { BehaviorSubject } from 'rxjs';
import { FlowElement, Edge, isNode } from 'react-flow-renderer';
import { uuid } from '@lib/utils';
import { update } from 'lodash';

import { edgeBuilder, getNodeInitialData, nodeBuilder } from './utils';
import type { StoreValue, BusinessData, CurrentElement, Data, NodeType } from './type';

export const getStoreInitialData = () => {
  const startId = 'formData' + uuid();
  const endId = 'end' + uuid();
  return {
    saved: false,
    errors: {
      publish: {},
      dataNotSaveMap: new Map(),
    },
    id: '',
    name: '',
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

export function removeNodeById(id: string) {
  let sourceId;
  let targetId;
  const newElements: FlowElement[] = [];
  const { elements } = store.value;
  elements.forEach((el) => {
    const element = el as Edge;
    if (element.target === id) {
      sourceId = element.source;
    }
    if (element.source === id) {
      targetId = element.target;
    }
    if (id !== element.id && element.source !== id && element.target !== id) {
      newElements.push(element);
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
  updater: (v: T) => T
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
  value: Partial<BusinessData>
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

export function buildBpmnText(
  version: string,
  nodeID: string,
  newBusinessData: BusinessData
) {
  return JSON.stringify({
    version,
    shapes: store.value.elements.map((el) => {
      if (el.id === nodeID) {
        return { ...el, data: { ...el.data, businessData: newBusinessData } };
      }
      return el;
    }),
  });
}

export default store;
