import { BehaviorSubject } from 'rxjs';
import { ArrowHeadType, Elements, FlowElement } from 'react-flow-renderer';

export type Condition = {
  fieldName: string,
  fieldValue: string;
  operator: string;
  operatorValue: string;
}
export type AndCondition = Condition[];
export type Conditions = AndCondition[];
export type AsideDrawerType = '' | 'formDataForm' | 'fillInForm' | 'approveForm' | 'components';
export type CurrentConnection = {[key: string]: unknown};

export interface FormDataData {
  form: { name: string; value: string; },
  triggerWay: 'whenAdd' | 'whenAlter' | '';
  whenAlterFields: string[];
  triggerCondition: Conditions;
  events: {},
}

export type AutoApproveRule = 'origin' | 'previous' | 'parent';

export interface FillInDataBasicConfig {
  approvePersons: string[];
  multiplePersonApproveWay: 'and' | 'or';
  whenNoApprovePerson: 'skip' | 'transferAdmin';
  autoApproveRules: AutoApproveRule[];
  timeRule: {
    deadLine: {
      breakPoint: 'firstEntry' | 'entry' | 'flowWorked';
      day: string;
      hours: string;
      minutes: string;
      urge: {
        day: number;
        hours: number;
        minutes: number;
        repeat: boolean;
      }
    },
    whenTimeout: {
      type: 'noDealWith' | 'autoDealWith' | 'jump';
      value: string;
    };
  };
}

export type ApproveDataBasicConfig = FillInDataBasicConfig;

export interface FillInData {
  basicConfig: FillInDataBasicConfig;
  fieldPermission: FieldPermission;
  operatorPermission: {value: string; text: string;}[];
  events: {};
}

export interface FieldPermission {
  fieldName: string;
  read: boolean;
  write: boolean;
  initialValue: string;
  submitValue: string;
  children: FieldPermission[];
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
}

const store = new BehaviorSubject<StoreValue>({
  asideDrawerType: '',
  currentConnection: {},
  elements: [
    {
      id: '1',
      type: 'formData',
      data: {
        nodeData: { width: 200, height: 72, name: '工作表触发' },
        businessData: {
          form: { name: '', value: '' },
          triggerWay: '',
          whenAlterFields: [],
          triggerCondition: [],
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
});

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

export function updateDataField(elementType: string, fieldName: string, updater: Function) {
  store.next({
    ...store.value,
    elements: store.value.elements.map((element): FlowElement => {
      if (element.type === elementType) {
        const newElement = { ...element };
        newElement.data = {
          ...newElement.data,
          businessData: {
            ...newElement.data.businessData,
            [fieldName]: updater(newElement.data.businessData[fieldName]),
          },
        };
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

export function updateTriggerConditionField(
  currentCondition: Condition,
  newData: Partial<Condition>
) {
  updateDataField('formData', 'triggerCondition', (conditions: Conditions) => {
    return conditions.map((andCondition) => {
      return andCondition.map((condition): Condition => {
        if (condition === currentCondition) {
          return {
            ...condition,
            ...newData,
          };
        }
        return condition;
      });
    });
  });
}

export default store;
