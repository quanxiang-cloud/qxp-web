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

export type AsideDrawerType = string | 'formDataForm' | 'fillInForm' | 'approveForm' | 'components';
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
  persons: {
    employees: EmployeeOrDepartmentOfRole[];
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

export interface FillInData {
  basicConfig: BasicNodeConfig;
  fieldPermission: FieldPermission;
  operatorPermission: {value: string; text: string;}[];
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
  type: 'formData' | 'fillIn' | 'approve';
  data: Data;
  position: { x: number; y: number; };
}

export interface StoreValue {
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
}

export const storeInitialData = {
  name: '',
  version: '0.1',
  status: 'draft',
  processKey: uuid(),
  triggerMode: 'FORM_DATA',
  asideDrawerType: '',
  currentConnection: {},
  cancelable: false,
  urgeable: false,
  seeStatusAndMsg: false,
  nodeAdminMsg: false,
  elements: [
    {
      id: '1',
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
      id: '2',
      type: 'end',
      data: { nodeData: { name: '结束', width: 100, height: 28 } },
      position: { x: 0, y: 0 },
    },
    {
      id: 'e1-2',
      type: 'plus',
      source: '1',
      target: '2',
      label: '+',
      arrowHeadType: ArrowHeadType.ArrowClosed,
    },
  ],
};

const store = new BehaviorSubject<StoreValue>(storeInitialData);

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

export function updateStore(key: string | null, updater: Function) {
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

export function updateDataField(elementType: string, fieldName: string | null, updater: Function) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element): FlowElement => {
      if (element.type === elementType) {
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

function _updateTriggerConditionField(
  conditions: TriggerCondition,
  currentCondition: TriggerConditionExpressionItem,
  newData: Partial<TriggerConditionExpressionItem> | null,
): TriggerCondition {
  const { expr } = conditions;

  if (!expr) {
    return {
      ...conditions,
      ...newData,
    } as TriggerCondition;
  }

  return {
    ...conditions,
    expr: expr.map((exprItem) => {
      if (exprItem === currentCondition) {
        if (newData === null) {
          return false;
        }
        return {
          ...exprItem,
          ...newData,
        };
      } else if (
        (exprItem as TriggerCondition).expr && (exprItem as TriggerCondition).expr.length
      ) {
        return _updateTriggerConditionField(
          exprItem as TriggerCondition,
          currentCondition,
          newData
        );
      } else {
        return exprItem;
      }
    }).filter(Boolean) as TriggerConditionExpression,
  };
}
export function updateTriggerConditionField(
  currentCondition: TriggerConditionExpressionItem,
  newData: Partial<TriggerConditionExpressionItem> | null,
) {
  updateDataField('formData', 'triggerCondition', (conditions: TriggerCondition) => {
    return _updateTriggerConditionField(conditions, currentCondition, newData);
  });
}

export default store;
