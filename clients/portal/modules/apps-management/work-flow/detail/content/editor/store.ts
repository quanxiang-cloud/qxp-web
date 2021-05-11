import { BehaviorSubject } from 'rxjs';
import { ArrowHeadType, Elements, FlowElement, Edge } from 'react-flow-renderer';

import { uuid } from '@lib/utils';

export type Operator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | '';
export type TriggerConditionExpressionItem = TriggerCondition | {
  key: string;
  op: Operator;
  value: string;
};
export type TriggerConditionExpression = TriggerConditionExpressionItem[]
export interface TriggerCondition {
  op: 'or' | 'and' | '';
  expr: TriggerConditionExpression;
}

export type AsideDrawerType = string | 'components';
export type CurrentConnection = {[key: string]: unknown};
export type TriggerWayValue = string | 'whenAdd' | 'whenAlter' | '';
export type TriggerWay = TriggerWayValue[];

export interface FormDataData {
  form: { name: string; value: string; },
  triggerWay: TriggerWay;
  whenAlterFields: string[];
  triggerCondition: TriggerCondition;
  events: {},
}

export interface UrgeItem {
  day: string;
  hours: string;
  minutes: string;
}
export interface Urge extends UrgeItem {
  repeat: {
    day: string;
    hours: string;
    minutes: string;
  };
}

export type AutoApproveRule = 'origin' | 'previous' | 'parent';
export interface WhenTimeout {
  type: 'noDealWith' | 'autoDealWith' | 'jump' | '';
  value: string;
}

export interface BasicNodeConfig {
  approvePersons: {
    users: EmployeeOrDepartmentOfRole[];
    departments: EmployeeOrDepartmentOfRole[];
  };
  multiplePersonWay: 'and' | 'or';
  whenNoPerson: 'skip' | 'transferAdmin';
  autoRules: AutoApproveRule[];
  timeRule: {
    deadLine: {
      breakPoint: 'firstEntry' | 'entry' | 'flowWorked';
      day: string;
      hours: string;
      minutes: string;
      urge: Urge;
    },
    whenTimeout: WhenTimeout;
  };
}

export interface DefaultOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  defaultText: string;
  text: string;
}

export interface CustomOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  defaultText?: string;
  text?: string;
}

export interface OperationPermission {
  default: DefaultOperation[];
  custom: CustomOperation[];
}

export interface FillInData {
  basicConfig: BasicNodeConfig;
  fieldPermission: FieldPermission;
  operatorPermission: OperationPermission;
  events: {};
}

export interface CustomFieldPermission {
  fieldName: string;
  read: boolean;
  write: boolean;
  initialValue: {
    variable: string;
    static: string;
  };
  submitValue: {
    variable: string;
    static: string;
  };
  id: string;
  children?: string[];
  parent?: string;
}

export interface SystemFieldPermission {
  fieldName: string;
  read: boolean;
  id: string;
  children?: string[];
  parent?: string;
}

export interface FieldPermission {
  custom: CustomFieldPermission[];
  system: SystemFieldPermission[];
}

export type BusinessData = FormDataData & FillInData;
export type NodeData = { width: number, height: number, name: string };
export type Data = {
  businessData: BusinessData;
  nodeData: NodeData;
}

export interface CurrentElement {
  id: string;
  type: string | 'formData' | 'fillIn' | 'approve';
  data: Data;
  position: { x: number; y: number; };
}

export interface StoreValue {
  creatorId?: string;
  id?: string;
  asideDrawerType: AsideDrawerType;
  currentConnection: CurrentConnection;
  elements: Elements;
  name: string;
  version: string;
  processKey: string,
  triggerMode: string | 'FORM_DATA' | 'FORM_TIME',
  cancelable: boolean;
  urgeable: boolean;
  seeStatusAndMsg: boolean;
  nodeAdminMsg: boolean;
  status: string;
  errors: Record<string, unknown> & {
    publish: {
      data?: FlowElement;
      msg?: string;
    }
  };
}

export const getStoreInitialData = () => {
  const startId = 'formData' + uuid();
  const endId = 'end' + uuid();
  return {
    errors: {
      publish: {},
    },
    id: '',
    name: '',
    version: '0.1',
    status: 'DISABLE',
    processKey: '',
    triggerMode: 'FORM_DATA',
    asideDrawerType: '',
    currentConnection: {},
    cancelable: false,
    urgeable: false,
    seeStatusAndMsg: false,
    nodeAdminMsg: false,
    elements: [
      {
        id: startId,
        type: 'formData',
        data: {
          nodeData: { width: 200, height: 72, name: '工作表触发' },
          businessData: {
            form: { name: '', value: '' },
            triggerWay: [],
            whenAlterFields: [],
          },
        },
        position: { x: 0, y: 0 },
      },
      {
        id: endId,
        type: 'end',
        data: { nodeData: { name: '结束', width: 100, height: 28 } },
        position: { x: 0, y: 0 },
      },
      {
        id: `e${startId}-${endId}`,
        type: 'plus',
        source: startId,
        target: endId,
        label: '+',
        arrowHeadType: ArrowHeadType.ArrowClosed,
      },
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
  elements.forEach((element) => {
    if ((element as Edge).target === id) {
      sourceId = (element as Edge).source;
    }
    if ((element as Edge).source === id) {
      targetId = (element as Edge).target;
    }
    if (id !== element.id && (element as Edge).source !== id && (element as Edge).target !== id) {
      newElements.push(element);
    }
  });
  if (sourceId && targetId) {
    newElements.push({
      id: `e${sourceId}-${targetId}`,
      type: 'plus',
      source: sourceId,
      target: targetId,
      label: '+',
      arrowHeadType: ArrowHeadType.ArrowClosed,
    });
  }

  store.next({
    ...store.value,
    elements: newElements,
  });
}

export function updateStore<T>(
  key: string | null,
  updater: (st: T) => T
) {
  const value = store.value as any;
  if (!key) {
    return store.next({
      ...value,
      ...updater(value),
    });
  }
  store.next({
    ...value,
    [key]: updater(value[key]),
  });
}

export function updateDataField(id: string, fieldName: string | null, updater: Function) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element): FlowElement => {
      if (element.id === id) {
        const newElement = { ...element };
        if (fieldName) {
          newElement.data = {
            ...newElement.data,
            businessData: {
              ...newElement.data.businessData,
              [fieldName]: updater(newElement.data.businessData[fieldName]),
            },
          };
        } else {
          newElement.data = {
            ...newElement.data,
            businessData: {
              ...newElement.data.businessData,
              ...updater(newElement.data.businessData),
            },
          };
        }
        return newElement;
      }
      return element;
    }),
  });
}

export function updateNodeData(elementType: string, fieldName: string, updater: Function) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element): FlowElement => {
      if (element.type === elementType) {
        const newElement = { ...element };
        newElement.data = {
          ...newElement.data,
          nodeData: {
            ...newElement.data.nodeData,
            [fieldName]: updater(newElement.data.nodeData[fieldName]),
          },
        };
        return newElement;
      }
      return element;
    }),
  });
}

export default store;
