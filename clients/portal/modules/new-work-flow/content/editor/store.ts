/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
import { BehaviorSubject } from 'rxjs6';
import { FlowElement, isNode } from 'react-flow-renderer';
import { uuid } from '@lib/utils';
import { update, omit, isArray } from 'lodash';
import moment from 'moment';

import { SaveWorkFlowParamsType } from '@newFlow/api';

import { edgeBuilder, nodeBuilder } from './utils';
import type { StoreValue, BusinessData, CurrentElement, Data, FormDataElement, DelayedData } from './type';
import { CURRENT_WORK_FLOW_VERSION } from './utils/constants';
import { groupBy } from 'ramda';

const getStoreInitialData = (triggerMethod: string): StoreValue => {
  const startID = (triggerMethod === 'form-data' ? 'formData' : 'FORM_TIME') + uuid();
  const endID = 'end' + uuid();
  const triggerMode = triggerMethod === 'form-data' ? 'FORM_DATA' : 'FORM_TIME';

  let startNode = nodeBuilder(startID, 'formData', '工作表触发', {
    parentID: [],
    childrenID: [endID],
  });
  if (triggerMethod !== 'form-data') {
    startNode = nodeBuilder(startID, 'FORM_TIME', '定时触发', {
      parentID: [],
      childrenID: [endID],
    });
  }
  return {
    cron: (startNode?.data?.businessData as DelayedData )?.timer || '',
    saved: false,
    needSaveFlow: false,
    readonly: false,
    errors: {
      publish: {},
      dataNotSaveMap: new Map(),
    },
    id: '',
    name: '未命名工作流' + moment().format('YYYY-MM-DD-HH-mm-ss'),
    apiFetched: false,
    validating: false,
    version: CURRENT_WORK_FLOW_VERSION,
    status: 'DISABLE',
    keyFields: '',
    instanceName: '',
    processKey: '',
    triggerMode,
    nodeIdForDrawerForm: '',
    currentConnection: {},
    cancelable: true,
    urgeable: true,
    canCancelType: 1,
    canCancelNodes: '',
    seeStatusAndMsg: true,
    nodeAdminMsg: true,
    elements: [
      startNode,
      nodeBuilder(endID, 'end', '结束', {
        width: 100,
        height: 28,
        parentID: [startID],
        childrenID: [],
      }),
      ...edgeBuilder(startID, endID),
    ],
  };
};

const store = new BehaviorSubject<StoreValue>(getStoreInitialData('form-data'));
export function initStore(triggerMethod: string): void {
  store.next(getStoreInitialData(triggerMethod));
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

function numberTransform(keys: string[], data: any): any {
  keys.forEach((key) => update(data, key, (v) => +v));
  return data;
}

export function buildWorkFlowSaveData(
  appID: string, saveData: Partial<BusinessData> = {},
): SaveWorkFlowParamsType| any {
  const {
    version, nodeIdForDrawerForm, name, triggerMode, cancelable, urgeable, nodeAdminMsg,
    seeStatusAndMsg, keyFields, instanceName, canCancelNodes, canCancelType, cron, id, status,
  } = store.value;
  const newcron = (saveData as Partial<DelayedData>).timer || cron || '';
  store.next({ ...store.value, cron: newcron });

  const _elements = store?.value?.elements?.map((el)=>{
    const _el = JSON.parse(JSON.stringify(el));
    delete _el?.position;
    delete _el?.data?.nodeData?.width;
    delete _el?.data?.nodeData?.height;
    return _el;
  });

  return {
    bpmnText: buildBpmnText(version, nodeIdForDrawerForm, saveData),
    name: name as string,
    triggerMode: triggerMode as string,
    canCancel: cancelable ? 1 : 0,
    canUrge: urgeable ? 1 : 0,
    canMsg: nodeAdminMsg ? 1 : 0,
    canViewStatusMsg: seeStatusAndMsg ? 1 : 0,
    appId: appID,
    keyFields,
    instanceName,
    canCancelNodes,
    canCancelType,
    cron: newcron,
    pipelineName: id,
    status,
  };
}

function buildBpmnText(
  version: string,
  nodeID: string,
  newBusinessData: Partial<BusinessData>,
): string {
  let ele = store.value.elements;
  if (parseFloat(version) >= 0.3) {
    const _elements = store.value.elements.map((el)=>{
      const _el = JSON.parse(JSON.stringify(el));
      delete _el?.position;
      delete _el?.data?.nodeData?.width;
      delete _el?.data?.nodeData?.height;
      return _el;
    });
    const { nodes: _nodes = [] } = groupBy((el) => (isNode(el) ? 'nodes' : 'edges'), _elements);
    ele = _nodes;
  }

  return JSON.stringify({
    version,
    shapes: ele.map((el) => {
      let data: any = el;
      if (el.id === nodeID) {
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

      if (data.type === 'approve') {
        delete data?.data?.businessData?.events;
        delete data?.data?.businessData?.operatorPermission?.custom;
      }

      if (data.type === 'fillIn') {
        const _data = JSON.parse(JSON.stringify(data));
        try {
          _data.data.businessData.basicConfig.fillInPersons = _data.data.businessData.basicConfig.approvePersons;
          if (_data.data.businessData.basicConfig.fillInPersons.type !== 'person') {
            _data.data.businessData.basicConfig.fillInPersons.users = [];
          }
          delete _data?.data?.businessData?.events;
          delete _data?.data?.businessData?.operatorPermission;
          delete _data?.data?.businessData?.basicConfig?.autoRules;
          delete _data?.data?.businessData?.basicConfig?.timeRule;
          delete _data?.data?.businessData?.basicConfig?.whenNoPerson;
          delete _data?.data?.businessData?.basicConfig?.approvePersons;
          delete _data?.data?.businessData?.basicConfig?.fillInPersons?.departments;
          delete _data?.data?.businessData?.basicConfig?.multiplePersonWay;
          const fieldPermission = _data?.data?.businessData?.fieldPermission || {};
          for (const key in fieldPermission) {
            fieldPermission[key] = fieldPermission[key]?.['x-internal']?.permission;
          }
          if (isArray(_data?.data?.businessData?.basicConfig?.fillInPersons?.users)) {
            _data.data.businessData.basicConfig.fillInPersons.users = _data?.data?.businessData?.basicConfig?.fillInPersons?.users?.filter((item: any)=>!!item)?.map((item: any)=>{
              // return item?.id ? item?.id : item;
              return { id: item?.id };
            });
          }
          return { ..._data, data: omit(_data.data, ['type']) };
        } catch (error) {
          console.log(error);
        }
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

export function toggleNodeForm(id: string, fillInPersons?: any): void {
  updateStore((s) => {
    const _elements = s.elements.map((item: any)=>{
      try {
        if (fillInPersons && item.id === id && item?.data?.businessData?.basicConfig?.approvePersons?.users) {
          item.data.businessData.basicConfig.approvePersons.users = fillInPersons;
        }
      } catch (error) {
      }
      return item;
    });
    return {
      ...s,
      elements: _elements,
      nodeIdForDrawerForm: id,
      showDataNotSaveConfirm: false,
      errors: {
        ...s.errors,
        dataNotSaveMap: new Map(),
      },
    };
  });
}

export default store;
