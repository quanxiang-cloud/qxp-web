import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Position, ArrowHeadType, FlowElement, Elements } from 'react-flow-renderer';

export interface NodeProps {
  id: string;
  data: Record<string, unknown>;
  type: string;
  selected: boolean;
  sourcePosition: string;
  targetPosition: string;
}

export interface EdgeProps {
  id: string;
  source: string;
  target: string;
  selected: boolean;
  animated: boolean;
  label: string;
  labelStyle: CSSProperties;
  labelShowBg: boolean;
  labelBgStyle: CSSProperties;
  labelBgPadding: number;
  labelBgBorderRadius: number;
  data: Record<string, unknown>;
  style: CSSProperties;
  arrowHeadType: ArrowHeadType;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  markerEndId: string;
}
export interface EdgeTextProps extends HTMLAttributes<SVGElement> {
  x: number;
  y: number;
  width?: number | string;
  height?: number | string;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  rectClassName?: string;
  textClassName?: string;
}

export interface Rect extends Dimensions, XYPosition {}

export interface Dimensions {
  width: number;
  height: number;
}

export interface XYPosition {
  x: number;
  y: number;
}

export type Operator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | '';
export type TriggerConditionValue = {
  key: string;
  op: Operator;
  value: string;
}
export type TriggerConditionExpressionItem = TriggerCondition | TriggerConditionValue;
export type TriggerConditionExpression = TriggerConditionExpressionItem[]
export type TriggerCondition = {
  op: 'or' | 'and' | '';
  expr: TriggerConditionExpression;
}
export type AsideDrawerType = string | 'components';
export type CurrentConnection = {
  source?: string;
  target?: string;
  position?: XYPosition;
}
export type TriggerWayValue = string | 'whenAdd' | 'whenAlter' | '';
export type TriggerWay = TriggerWayValue[];
export type NodeWorkForm = { name: string; value: string };
export type FormDataData = {
  form: NodeWorkForm;
  triggerWay: TriggerWay;
  whenAlterFields: string[];
  triggerCondition: TriggerCondition;
  events: {};
}
export type TriggerValue = {
  triggerWay: TriggerWay;
  whenAlterFields: string[];
}

export interface UrgeItem {
  day: number;
  hours: number;
  minutes: number;
}
export interface Urge extends UrgeItem {
  repeat: {
    day: number;
    hours: number;
    minutes: number;
  };
}

export type AutoApproveRule = 'origin' | 'previous' | 'parent';
export interface WhenTimeout {
  type: 'noDealWith' | 'autoDealWith' | 'jump' | '';
  value: string;
}
export type BreakPoint = 'firstEntry' | 'entry' | 'flowWorked';
export interface DeadLine {
  breakPoint: BreakPoint;
  day: number;
  hours: number;
  minutes: number;
  urge: Urge;
}
export type TimeRule = {
  enabled: boolean;
  deadLine: DeadLine;
  whenTimeout: WhenTimeout;
}

export interface BasicNodeConfig {
  approvePersons: {
    users: EmployeeOrDepartmentOfRole[];
    departments: EmployeeOrDepartmentOfRole[];
  };
  multiplePersonWay: 'and' | 'or';
  whenNoPerson: 'skip' | 'transferAdmin';
  autoRules: AutoApproveRule[];
  timeRule: TimeRule;
}

export interface SystemOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  text: string;
  value: string;
}

export interface CustomOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  text?: string;
  value: string;
}

export interface OperationPermission {
  system: SystemOperation[];
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

export type NodeType = 'formData' | 'fillIn' | 'approve' | 'end';

export interface CurrentElement {
  id: string;
  type: NodeType;
  data: Data;
  position: XYPosition;
}

export type Errors = Record<string, unknown> & {
    publish: {
      data?: FlowElement;
      msg?: string;
    },
    dataNotSaveMap: Map<string, boolean>;
};

export interface StoreValue {
  creatorId?: string;
  apiFetched: boolean;
  validating: boolean;
  saved: boolean;
  id?: string;
  nodeIdForDrawerForm: AsideDrawerType;
  currentConnection: CurrentConnection;
  elements: Elements<Data>;
  name: string;
  version: string;
  processKey: string,
  triggerMode: string | 'FORM_DATA' | 'FORM_TIME',
  cancelable: boolean;
  urgeable: boolean;
  seeStatusAndMsg: boolean;
  nodeAdminMsg: boolean;
  status: string;
  errors: Errors;
  currentDataNotSaveConfirmCallback?: Function;
  showDataNotSaveConfirm?: boolean;
}
