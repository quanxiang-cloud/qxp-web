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

  export type NodeProps = import('react-flow-renderer').NodeProps<POLY_API.SubjectPolyNode>;
  export type NodeWrapperProps = import('react').PropsWithChildren<{
    bottomTrigger?: boolean;
    rightTrigger?: boolean;
    noPadding?: boolean;
    title?: string;
    noBg?: boolean;
  }> & NodeProps;

  export type PolyParams = {
    appID: string;
    polyID: string;
  }

  export interface PolyNodeInput {
    type: string;
    name: string;
    desc: string;
    data?: string;
    in: string;
    required: boolean;
  }

  export interface PolyConst {
    type: string;
    name: string;
    desc: string;
    data: string;
    in: 'hide';
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

  export type PolyNodeType = 'input' | 'if' | 'request' | 'end';

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

  export type PolyStartNode = PolyNodeGeneric<'input', PolyStartNodeDetail>;
  export type PolyRequestNode = PolyNodeGeneric<'request', PolyRequestNodeDetail>;
  export type PolyIfNode = PolyNodeGeneric<'if', PolyCondNodeDetail>;
  export type PolyEndNode = PolyNodeGeneric<'end', PolyEndNodeDetail>;
  export type PolyNode = PolyStartNode | PolyRequestNode | PolyIfNode | PolyEndNode;
  export interface RootObject<T> {
    namespace: string;
    name: string;
    desc: string;
    version: string;
    id: string;
    encoding: string;
    currentNodeConfigParams: {
      schema?: ISchema;
      configForm?: React.JSXElementConstructor<any>;
      currentNode?: import('@polyApi/store/node').PolyNodeStore;
      onClose?: () => void;
    }
    nodes: T;
  }
}
