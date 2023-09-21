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
  cron?: string,
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

interface Dimensions {
  width: number;
  height: number;
}

interface XYPosition {
  x: number;
  y: number;
}

export type Operator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'null' | 'not-null' | 'any'
  | 'all' | 'range' | 'include' | 'not-include' | '';
export type TriggerConditionValue = {
  key: string;
  op: Operator;
  value: any;
}
export type TriggerConditionExpressionItem = TriggerCondition | TriggerConditionValue;
export type TriggerConditionExpression = TriggerConditionExpressionItem[]
export type TriggerCondition = {
  op: 'or' | 'and' | '';
  expr: TriggerConditionExpression;
}
type AsideDrawerType = string | 'components';
export type CurrentConnection = {
  source?: string;
  target?: string;
  position?: XYPosition;
}
export type TriggerWayValue = string | 'whenAdd' | 'whenAlter' | '';
type TriggerWay = TriggerWayValue[];
export type NodeWorkForm = { name?: string; value: string };

export type FormDataData = {
  form: NodeWorkForm;
  triggerWay: TriggerWay;
  whenAlterFields: string[];
  triggerCondition: TriggerCondition;
  events: Record<any, any>;
}

export type DelayedData = {
  timer: string
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
type BreakPoint = 'firstEntry' | 'entry' | 'flowWorked';
export interface DeadLine {
  breakPoint: BreakPoint;
  day: number;
  hours: number;
  minutes: number;
  urge: Urge;
}
type TimeRule = {
  enabled: boolean;
  deadLine: DeadLine;
  whenTimeout: WhenTimeout;
}
export type ApprovePersonType =
| 'person'
| 'field'
| 'position'
| 'superior'
| 'leadOfDepartment'
| 'processInitiator';

export type ApprovePerson = {
  type: ApprovePersonType;
  users: EmployeeOrDepartmentOfRole[];
  departments: EmployeeOrDepartmentOfRole[];
  positions: string[];
  fields: string[];
  variablePath: string;
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
  formulaFields: Record<string, string>;
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
  valueFrom: 'fixedValue' | 'currentFormValue' | 'processVariable' | 'formula';
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
      type: string;
      tableId: string;
      // todo: refactor structure
      createRules: Array<{
        [key: string]: ValueRule;
      }>;
    }
  }
}

export type SelectFormType = 'work-form' | 'others';
export interface TableDataUpdateData {
  targetTableId: string;
  silent: boolean;
  selectField?: string;
  formType?: SelectFormType;
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

type Receiver = {
  type: 1 | 2,
  id: string,
  name: string,
  account: string,
}
export interface SendEmailData {
  approvePersons: ApprovePerson;
  content: string;
  templateId: string;
  title: string;
  mes_attachment: Attachment[];
  formulaFields: Record<string, string>;
  fieldType: Record<string, string>;
  recivers: Receiver[];
  type: string;
}
export interface WebMessageData {
  approvePersons: ApprovePerson;
  sort: 1 | 2;
  content: string;
  title: string;
}
export interface CCData {
  approvePersons: ApprovePerson;
}
export interface FieldValue {
  variable: string;
  staticValue: any;
}
export interface CustomFieldPermission {
  fieldName: string;
  editable: boolean;
  invisible: boolean;
  readonly: boolean;
  write: boolean;
  read: boolean;
  initialValue: FieldValue;
  submitValue: FieldValue;
  id: string;
  path: string;
  hidden: boolean;
}

export interface SystemFieldPermission {
  fieldName: string;
  read: boolean;
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
  WebMessageData | CCData | ProcessBranchTargetData | WebhookData | DelayedData;

type NodeData = {
  width: number;
  height: number;
  name: string;
  parentID?: string[];
  childrenID?: string[];
  branchID?: string;
  branchTargetElementID?: string;
  parentBranchTargetElementID?: string;
};
interface BaseNodeData {
  type: NodeType;
  nodeData: NodeData;
  businessData: BusinessData;
}
interface FillInNodeData extends BaseNodeData {
  type: 'fillIn';
  businessData: FillInData;
}
interface WebhookNodeData extends BaseNodeData {
  type: 'webhook';
  businessData: WebhookData;
}
interface ApproveNodeData extends BaseNodeData {
  type: 'approve';
  businessData: FillInData;
}
interface FormDataNodeData extends BaseNodeData {
  type: 'formData';
  businessData: FormDataData;
}
interface DelayedNodeData extends BaseNodeData {
  type: 'FORM_TIME';
  businessData: DelayedData;
}
interface ProcessBranchNodeData extends BaseNodeData {
  type: 'processBranch';
  businessData: ProcessBranchData;
}
interface ProcessVariableAssignmentNodeData extends BaseNodeData {
  type: 'processVariableAssignment';
  businessData: ProcessVariableAssignmentData;
}
interface TableDataCreateNodeData extends BaseNodeData {
  type: 'tableDataCreate';
  businessData: TableDataCreateData;
}
interface TableDataUpdateNodeData extends BaseNodeData {
  type: 'tableDataUpdate';
  businessData: TableDataUpdateData;
}
interface SendEmailNodeData extends BaseNodeData {
  type: 'email';
  businessData: SendEmailData;
}
interface WebMessageNodeData extends BaseNodeData {
  type: 'letter';
  businessData: WebMessageData;
}
interface CCNodeData extends BaseNodeData {
  type: 'autocc';
  businessData: CCData;
}
interface ProcessBranchTargetNodeData extends BaseNodeData {
  type: 'processBranchTarget';
  businessData: ProcessBranchTargetData;
}

export type Data = CCNodeData | WebMessageNodeData | SendEmailNodeData | TableDataUpdateNodeData |
  TableDataCreateNodeData | ProcessVariableAssignmentNodeData | ProcessBranchNodeData |
  FormDataNodeData | ApproveNodeData | FillInNodeData | ProcessBranchTargetNodeData | WebhookNodeData | DelayedNodeData;

export type NodeType = 'formData' | 'fillIn' | 'approve' | 'end' | 'processBranch' |
'processVariableAssignment' | 'tableDataCreate' | 'tableDataUpdate' | 'FORM_TIME' | 'email' |
  'letter' | 'autocc' | 'processBranchSource' | 'processBranchTarget' | 'webhook';
export interface CurrentElement {
  id: string;
  type: NodeType;
  data: Data;
  position: XYPosition;
}
export interface FormDataElement extends CurrentElement {
  data: FormDataNodeData;
}
type Errors = Record<string, unknown> & {
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
  cron: string;
}

export type FieldOperatorOptions = {
  label: string;
  value: Operator;
}[]

export type WebhookData = {
  type: 'request', config: RequestConfig
} | {
  type: 'send', config: SendConfig
};
export interface Input {
  // 只有当 type 为 string | number | boolean 时, data 才为 string | null
  // 只有当 type 为 direct_expr 时, data 才为公式(公式包含前置节点的变量或API节点的输出)
  // 其他情况 data 是递归 Input[] 结构
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'direct_expr';
  name: string;
  data: Input[] | string | null;
  in: 'body' | 'path' | 'header' | 'query' | ''; // 参数位置
  required?: boolean;
  mock?: string;
  desc?: string;
  title?: string;
  id?: string; // 仅前端使用, 后端忽略
}

export interface RequestConfig {
  api: {
    value: string; // api 的 path
    options: any[];
  };
  // url, method, inputs, outputs 均根据 api 的 path 调用 api doc 获取
  // 前端最终可能不会存 url, method, outputs, 仅存 inputs 配置的值
  inputs: Input[] | any; // API 定义的输入以及字段的公式映射配置
  url: string; // 可选
  method: HTTPMethod; // 可选
  outputs?: Input[]; // API 定义的输出(可选)
  sendUrl?: string; // 可选
}

export interface SendConfig {
  sendUrl: string; // 手动定义
  sendMethod: HTTPMethod; // 手动选择
  contentType: 'application/json',
  inputs: Input[]; // 用户自定义的输入, 自定义 url 应该没有 outputs?
  outputs: undefined;
}
