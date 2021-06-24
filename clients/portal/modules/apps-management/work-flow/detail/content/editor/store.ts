import { BehaviorSubject } from 'rxjs';
import { FlowElement } from 'react-flow-renderer';
import { uuid } from '@lib/utils';
import { update, omit } from 'lodash';
import moment from 'moment';

import { SaveWorkFlow } from '@flow/detail/api';

import { edgeBuilder, nodeBuilder } from './utils';
import type { StoreValue, BusinessData, CurrentElement, Data, FormDataElement } from './type';

export const getStoreInitialData = (): StoreValue => {
  const startID = 'formData' + uuid();
  const endID = 'end' + uuid();
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
      nodeBuilder(startID, 'formData', '工作表触发', {
        parentID: [],
        childrenID: [endID],
      }),
      nodeBuilder(endID, 'end', '结束', {
        width: 100,
        height: 28,
        parentID: [startID],
        childrenID: [],
      }),
      edgeBuilder(startID, endID),
    ],
  };
};

const store = new BehaviorSubject<StoreValue>(getStoreInitialData());

export function initStore(): void {
  store.next(getStoreInitialData());
}

export function updateStore(updater: (st: StoreValue) => StoreValue): void {
  return store.next({
    ...store.value,
    ...updater(store.value),
  });
}

export function updateStoreByKey<T>(key: keyof StoreValue, updater: (st: T) => T): void {
  store.next({
    ...store.value,
    [key]: updater(store.value[key] as T),
  });
}

export function updateBusinessDataByKey<T>(
  id: string,
  fieldName: keyof BusinessData,
  updater: (v: T) => T,
): void {
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
): void {
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

export function updateNodeDataByKey<T>(elementId: string, fieldName: string, updater: (v: T) => T): void {
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
): void {
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

export function getNodeElementById(id: string): CurrentElement {
  return store.value.elements?.find((element) => element.id === id) as CurrentElement;
}

export function getFormDataElement(): FormDataElement {
  return store.value.elements?.find(({ type }) => type === 'formData') as FormDataElement;
}

export function numberTransform(keys: string[], data: any): any {
  keys.forEach((key) => update(data, key, (v) => +v));
  return data;
}

export function buildWorkFlowSaveData(
  appID: string, saveData: Partial<BusinessData> = {},
): SaveWorkFlow {
  const {
    version, nodeIdForDrawerForm, name, triggerMode, cancelable, urgeable, nodeAdminMsg,
    seeStatusAndMsg,
  } = store.value;
  return {
    bpmnText: buildBpmnText(version, nodeIdForDrawerForm, saveData),
    name: name as string,
    triggerMode: triggerMode as string,
    canCancel: cancelable ? 1 : 0,
    canUrge: urgeable ? 1 : 0,
    canMsg: nodeAdminMsg ? 1 : 0,
    canViewStatusMsg: seeStatusAndMsg ? 1 : 0,
    appId: appID,
  };
}

export function buildBpmnText(
  version: string,
  nodeID: string,
  newBusinessData: Partial<BusinessData>,
): string {
  return JSON.stringify({
    version,
    shapes: store.value.elements.map((el) => {
      let data: any = el;
      if (el.id == nodeID) {
        data = {
          ...el,
          data: {
            ...omit(el.data, ['type']),
            businessData: { ...el.data?.businessData, ...newBusinessData },
          },
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
      ], { ...data, data: omit(data.data, ['type']) });
    }),
  });
}

export default store;
