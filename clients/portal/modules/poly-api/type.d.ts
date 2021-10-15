declare namespace POLY_API {
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
    type: 'input';
    data: {
      inputs: PolyNodeInput[];
      consts: PolyConst[];
    }
  }

  export interface PolyCondNodeDetail {
    type: 'if';
    data: {
      cond: PolyNodeCond;
      yes: string;
      no: string;
    }
  }

  export interface PolyRequestNodeDetail {
    type: 'request';
    data: {
      rawPath: string;
      apiName: string;
      inputs: PolyNodeInput[];
    }
  }

  export interface PolyEndNodeDetail {
    type: 'end';
    data: {
      body: PolyEndBody;
    }
  }

  export type PolyNodeDetail = PolyStartNodeDetail | PolyRequestNodeDetail | PolyCondNodeDetail |
    PolyEndNodeDetail;

  export interface PolyNode {
    name?: string;
    title?: string;
    type?: PolyNodeType;
    nextNodes?: string[];
    label?: JSX.Element | string;
    detail?: PolyNodeDetail;
    handles: {
      left?: string;
      right?: string;
      top?: string;
      bottom?: string;
    },
  }

  export interface RootObject {
    namespace: string;
    name: string;
    desc: string;
    version: string;
    id: string;
    encoding: string;
    nodes: PolyNode[];
  }
}
