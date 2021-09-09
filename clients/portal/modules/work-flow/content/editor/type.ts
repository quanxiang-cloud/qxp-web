import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Position, ArrowHeadType, FlowElement, Elements } from 'react-flow-renderer';

export interface WorkFlow {
  version: string;
  shapes: FlowElement<Data>[];
}
type CanOp = '0' | '1' | 1 | 0;
export interface WorkFlowData {
  bpmnText: string;
  canCancel: CanOp;
  canMsg: CanOp;
  canUrge: CanOp;
  canViewStatusMsg: CanOp;
  createTime: string;
  creatorAvatar: string;
  creatorId: string;
  creatorName: string;
  id: string;
  isDeleted: CanOp;
  modifierId: string;
  modifierName: string;
  modifyTime: string;
  name: string;
  processKey: string;
  status: 'ENABLE' | 'DISABLE';
  triggerMode: 'FORM_DATA' | 'FORM_TIME';
  keyFields: string;
  instanceName: string;
  canCancelType: number,
  canCancelNodes: string,
}

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

export interface Rect extends Dimensions, XYPosition { }

export interface Dimensions {
  width: number;
  height: number;
}

export interface XYPosition {
  x: number;
  y: number;
}

export type Operator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'null' | 'not-null' | 'any'
  | 'all' | 'range' | 'include' | 'not-include' | '';
export type TriggerConditionValue = {
  key: string;
  op: Operator;
  value: string | string[];
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
export type ApprovePersonType = 'person' | 'field' | 'position' | 'superior' | 'leadOfDepartment' | 'processInitiator';
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

export interface Operation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  text?: string;
  value: string;
  reasonRequired?: boolean;
  only?: string;
}

export interface OperationPermission {
  system: Operation[];
  custom: Operation[];
}

export interface FillInData {
  basicConfig: BasicNodeConfig;
  fieldPermission: FieldPermission | NewFieldPermission;
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
  filterRule?: {
    tag: 'and' | 'or';
    conditions: Array<{
      fieldName: string;
      operator: 'eq' | 'neq' | 'in' | 'nin';
      value: ValueRuleVal;
    }>;
  };
  updateRule: Array<{
    fieldName: string;
    valueFrom: 'fixedValue' | 'currentFormValue' | 'processVariable' | 'formula';
    valueOf: ValueRuleVal;
  }>;
}

export type Attachment = {
  file_name: string;
  file_url: string;
}

export type Receiver = {
  type: 1 | 2,
  id: string,
  name: string,
  account: string,
}
export interface SendEmailData {
  type: ApprovePersonType;
  recivers: Receiver[];
  content: string;
  templateId: string;
  title: string;
  mes_attachment: Attachment[];
}
export interface WebMessageData {
  type: ApprovePersonType;
  recivers: Receiver[];
  sort: 1 | 2;
  content: string;
  title: string;
}
export interface CCData {
  type: ApprovePersonType;
  recivers: Receiver[];
}
export interface FieldValue {
  variable: string;
  staticValue: any;
}
export interface CustomFieldPermission {
  fieldName: string;
  invisible: boolean;
  read: boolean;
  write: boolean;
  initialValue: FieldValue;
  submitValue: FieldValue;
  id: string;
  path: string;
  hidden: boolean;
}

export interface SystemFieldPermission {
  fieldName: string;
  read: boolean;
  invisible: boolean;
  id: string;
}

export interface FieldPermission {
  custom: CustomFieldPermission[];
  system: SystemFieldPermission[];
}
export interface NewFieldPermissionValue {
  fieldName: string;
  'x-internal': {
    permission: number;
  },
  initialValue?: FieldValue;
  submitValue?: FieldValue;
}
export interface NewFieldPermission {
  [key: string]: NewFieldPermissionValue;
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
  parentBranchTargetElementID?: string;
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
  readonly?: boolean;
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
  canCancelType?: number;
  canCancelNodes: string;
  processKey: string,
  triggerMode: string | 'FORM_DATA' | 'FORM_TIME',
  cancelable: boolean;
  urgeable: boolean;
  seeStatusAndMsg: boolean;
  nodeAdminMsg: boolean;
  status: 'DISABLE' | 'ENABLE';
  errors: Errors;
  currentDataNotSaveConfirmCallback?: () => void;
  showDataNotSaveConfirm?: boolean;
  keyFields: string;
  instanceName: string;
}

export type FieldOperatorOptions = {
  label: string;
  value: Operator;
}[]
