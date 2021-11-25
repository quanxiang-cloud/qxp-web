declare namespace POLY_API {
  export type SubjectPolyNode = import('@polyApi/store/node').PolyNodeStore;
  export type NodeElement = import('react-flow-renderer').Node<SubjectPolyNode>;
  export type EdgeElement = import('react-flow-renderer').Edge<SubjectPolyNode>;
  export type PlainNodeElement = import('react-flow-renderer').Node<PolyNode>;
  export type PlainEdgeElement = import('react-flow-renderer').Edge<PolyNode>;
  export type Element = NodeElement | EdgeElement;
  export type PlainElement = PlainNodeElement | PlainEdgeElement;
  export type Root = RootObject<import('@polyApi/store/canvas').PolyCanvasStore>;
  export type PlainRoot = RootObject<PlainElement[]>;

  export type Meta = Omit<PlainNodeElement, 'data'>
  export type POLY_UIS = {
    edges: PlainEdgeElement[];
    metas: Meta[];
  }

  export type NodeProps = import('react-flow-renderer').NodeProps<POLY_API.SubjectPolyNode>;
  export type NodeWrapperProps = import('react').PropsWithChildren<{
    noPadding?: boolean;
    noBg?: boolean;
  }> & NodeProps;

  export type PolyParams = {
    appID: string;
    polyFullPath: string;
  }

  export interface PolyNodeInput {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'direct_expr';
    name: string;
    data: PolyNodeInput[] | string | null;
    in: 'body' | 'path' | 'header' | 'query';
    required?: boolean;
    mock?: string;
    desc?: string;
    title?: string;
  }

  export interface PolyConst {
    type: 'string' | 'number' | 'boolean';
    name: string;
    desc: string;
    data: string | boolean;
    in: 'hide';
  }

  export type PolyConstSchema = PolyConst & {
    children: [];
    index: number;
  }

  export type PolyConditionType = 'direct_expr';

  export interface PolyNodeCond {
    type: PolyConditionType;
    data: string;
  }

  export type PolyEndBodyData = {
    name: string;
    type: PolyEndBodyType;
    data: PolyEndBodyData[];
  } | {
    name: string;
    type: 'string';
    data: string;
  }

  export type PolyEndBodyType = 'object' | 'array';

  export interface PolyEndBody {
    type: PolyEndBodyType;
    data: PolyEndBodyData[];
  }

  export type PolyNodeType = 'input' | 'if' | 'request' | 'output';

  export interface PolyStartNodeDetail {
    inputs: PolyNodeInput[];
    consts: PolyConst[];
  }

  export interface PolyCondNodeDetail {
    cond: PolyNodeCond;
    yes: string;
    no: string;
  }

  export interface PolyRequestNodeDetail {
    rawPath: string;
    apiName: string;
    inputs: PolyNodeInput[];
    outputs?: PolyNodeInput[];
  }

  export interface PolyEndNodeDetail {
    body: PolyEndBody;
  }

  export interface PolyNodeGeneric<T, D> {
    name: string;
    type: T;
    nextNodes: string[];
    detail: D;
    title: string;
    label?: JSX.Element | string;
    handles: {
      left?: string;
      right?: string;
      top?: string;
      bottom?: string;
    },
  }

  export interface ObjectSchema {
    type: 'number' | 'string' | 'boolean' | 'object' | 'array' | 'direct_expr';
    in: 'body' | 'header' | 'query' | 'path',
    name: string | null;
    index: number;
    parentPath: string | null;
    required: boolean;
    desc: string;
    rule?: string;
    children: ObjectSchema[];
  }

  export type API_FIELD_TYPE = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'direct_expr';

  export type POLY_INFO = {
    id: string;
    owner: string;
    ownerName: string;
    namespace: string;
    name: string;
    title: string;
    active: 0 | 1;
    desc: string;
    access: string[];
    method: string;
    createAt: string;
    updateAt: string;
    buildAt: string;
  }

  export type PolyStartNode = PolyNodeGeneric<'input', PolyStartNodeDetail>;
  export type PolyRequestNode = PolyNodeGeneric<'request', PolyRequestNodeDetail>;
  export type PolyIfNode = PolyNodeGeneric<'if', PolyCondNodeDetail>;
  export type PolyEndNode = PolyNodeGeneric<'output', PolyEndNodeDetail>;
  export type PolyNodeDetail = PolyStartNodeDetail | PolyCondNodeDetail | PolyRequestNodeDetail |
    PolyEndNodeDetail;
  export type PolyNode = PolyStartNode | PolyRequestNode | PolyIfNode | PolyEndNode;
  export interface RootObject<T> {
    currentNodeConfigParams: {
      schema?: ISchema;
      configForm?: React.JSXElementConstructor<any>;
      currentNode?: import('@polyApi/store/node').PolyNodeStore;
      onClose?: () => void;
      excludedFields?: string[];
    }
    nodes: T;
    polyInfo?: POLY_INFO;
  }
}
