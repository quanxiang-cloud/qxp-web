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
export type NodeWorkForm = { name?: string; value: string };
export type FormDataData = {
  form: NodeWorkForm;
  triggerWay: TriggerWay;
  whenAlterFields: string[];
  triggerCondition: TriggerCondition;
  events: Record<any, any>;
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
export type ApprovePersonType = 'person' | 'field' | 'position' | 'superior' | 'leadOfDepartment';
export type ApprovePerson = {
  type: ApprovePersonType;
  users: EmployeeOrDepartmentOfRole[];
  departments: EmployeeOrDepartmentOfRole[];
  positions: string[];
  fields: string[];
}
export interface BasicNodeConfig {
  approvePersons: ApprovePerson;
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
  reasonRequired?: boolean;
}

export interface CustomOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  text?: string;
  value: string;
  reasonRequired?: boolean;
}

export interface OperationPermission {
  system: SystemOperation[];
  custom: CustomOperation[];
}

export interface FillInData {
  basicConfig: BasicNodeConfig;
  fieldPermission: FieldPermission;
  operatorPermission: OperationPermission;
  events: Record<any, any>;
}
export interface ProcessBranchData {
  ignore: boolean;
  rule: string;
}
export interface ProcessBranchTargetData {
  processBranchEndStrategy: 'any' | 'all';
}
export interface ProcessVariableAssignmentData {
  assignmentRules: Array<{
    variableName: string;
    valueFrom: 'fixedValue' | 'formula' | 'currentFormValue';
    valueOf: string | number;
  }>;
}
export interface ValueRule {
  valueFrom: 'fixedValue' | 'currentFormValue' | 'processVariable';
  valueOf: ValueRuleVal;
}
export type ValueRuleVal = string | number | Array<string | number>;
export interface TableDataCreateData {
  targetTableId: string;
  silent: boolean;
  createRule: {
    [key: string]: ValueRule;
  };
  ref: {
    [key: string]: {
      tableId: string;
      // todo: refactor structure
      createRules: Array<{
        [key: string]: ValueRule;
      }>;
    }
  }
}
export interface TableDataUpdateData {
  targetTableId: string;
  silent: boolean;
  // filterRule: {
  //   tag: 'and' | 'or';
  //   conditions: Array<{
  //     fieldName: string;
  //     operator: 'eq' | 'neq' | 'in' | 'nin';
  //     value: ValueRuleVal;
  //   }>;
  // };
  filterRule: string;
  updateRule: Array<{
    fieldName: string;
    valueFrom: 'fixedValue' | 'currentFormValue' | 'processVariable' | 'formula';
    valueOf: ValueRuleVal;
  }>;
}
export interface SendEmailData {
  [key: string]: unknown;
}
export interface WebMessageData {
  [key: string]: unknown;
}
export interface CCData {
  [key: string]: unknown;
}
export interface FieldValue {
  variable: string;
  staticValue: string;
}
export interface CustomFieldPermission {
  fieldName: string;
  read: boolean;
  write: boolean;
  initialValue: FieldValue;
  submitValue: FieldValue;
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

export type BusinessData = FormDataData | FillInData | ProcessBranchData |
  ProcessVariableAssignmentData | TableDataCreateData | TableDataUpdateData | SendEmailData |
  WebMessageData | CCData | ProcessBranchTargetData;
export type NodeData = {
  width: number;
  height: number;
  name: string;
  parentID?: string[];
  childrenID?: string[];
  branchID?: string;
  branchTargetElementID?: string;
};
export interface BaseNodeData {
  type: NodeType;
  nodeData: NodeData;
  businessData: BusinessData;
}
export interface FillInNodeData extends BaseNodeData {
  type: 'fillIn';
  businessData: FillInData;
}
export interface ApproveNodeData extends BaseNodeData {
  type: 'approve';
  businessData: FillInData;
}
export interface FormDataNodeData extends BaseNodeData {
  type: 'formData';
  businessData: FormDataData;
}
export interface ProcessBranchNodeData extends BaseNodeData {
  type: 'processBranch';
  businessData: ProcessBranchData;
}
export interface ProcessVariableAssignmentNodeData extends BaseNodeData {
  type: 'processVariableAssignment';
  businessData: ProcessVariableAssignmentData;
}
export interface TableDataCreateNodeData extends BaseNodeData {
  type: 'tableDataCreate';
  businessData: TableDataCreateData;
}
export interface TableDataUpdateNodeData extends BaseNodeData {
  type: 'tableDataUpdate';
  businessData: TableDataUpdateData;
}
export interface SendEmailNodeData extends BaseNodeData {
  type: 'email';
  businessData: SendEmailData;
}
export interface WebMessageNodeData extends BaseNodeData {
  type: 'letter';
  businessData: WebMessageData;
}
export interface CCNodeData extends BaseNodeData {
  type: 'autocc';
  businessData: CCData;
}
export interface ProcessBranchTargetNodeData extends BaseNodeData {
  type: 'processBranchTarget';
  businessData: ProcessBranchTargetData;
}
export type Data = CCNodeData | WebMessageNodeData | SendEmailNodeData | TableDataUpdateNodeData |
  TableDataCreateNodeData | ProcessVariableAssignmentNodeData | ProcessBranchNodeData |
  FormDataNodeData | ApproveNodeData | FillInNodeData | ProcessBranchTargetNodeData;
export type NodeType = 'formData' | 'fillIn' | 'approve' | 'end' | 'processBranch' |
  'processVariableAssignment' | 'tableDataCreate' | 'tableDataUpdate' | 'email' |
  'letter' | 'autocc' | 'processBranchSource' | 'processBranchTarget';
export interface CurrentElement {
  id: string;
  type: NodeType;
  data: Data;
  position: XYPosition;
}
export interface FormDataElement extends CurrentElement {
  data: FormDataNodeData;
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
  needSaveFlow?: boolean;
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
  currentDataNotSaveConfirmCallback?: () => void;
  showDataNotSaveConfirm?: boolean;
  keyFields: string;
  instanceName: string;
}

export type ProcessVariable = {
  code: string;
  name: string;
  fieldType: 'TEXT' | 'DATE' | 'NUMBER' | 'BOOLEAN';
}
