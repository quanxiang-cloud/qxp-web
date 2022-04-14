import { BaseBlocksCommunicationState } from '@one-for-all/artery-engine';
import { Repository } from '@one-for-all/render-engine';
import {
  BaseNode,
  APIStatesSpec,
  SharedStatesSpec,
  PlainState,
  LoopContainerNode,
} from '@one-for-all/artery';

export interface BlocksCommunicationType extends BaseBlocksCommunicationState {
  componentToAdd?: any;
  docLink?: string;
  hideTestPreview?: boolean;
  repository?: Repository;
  appID?: string;
  arteryID?: string;
}

export type ReactComp = React.ComponentType | React.JSXElementConstructor<any>;

export interface PageNode extends BaseNode {
  id: string;
  pid?: string; // only used on page-engine
  type: 'react-component' | 'loop-container' | 'html-element' | 'composed-node';
  label: string;
  name?: string; // for html node
  props?: any;
  node?: PageNode,
  outLayer?: PageNode,
  supportStateExposure?: boolean;
  // `packageName, packageVersion, exportName` only for react comp node
  packageName?: 'ofa-ui' | string;
  packageVersion?: 'latest' | string;
  exportName: 'page' | 'elemName' | string; // registry elem type
  toProps?: any; // func body
  children?: Array<PageNode>;
  defaultConfig?: any;
  defaultStyle?: React.CSSProperties;
  disableActions?: boolean;
  category?: string;
}

export interface PageArtery {
  node: PageNode;
  apiStateSpec: APIStatesSpec;
  sharedStatesSpec: SharedStatesSpec;
}

export type DragPos = 'up' | 'down' | 'left' | 'right' | 'inner';

// registry types
export type Category = 'basic' | 'layout' | 'form' | 'advanced' | 'systemComponents' | string;

export interface SourceElement<T> {
  name: string;
  component: ReactComp;
  defaultConfig: Record<string, any>; // 表单默认配置
  configForm: ReactComp; // 属性配置组件
  icon?: string;
  iconSize?: number;
  label: string;
  category: Category;
  toProps?: (formData: any) => T; // 将configForm的配置项转换到 component的 props
  order?: number; // 排序权重
  hidden?: boolean; // 在source panel 隐藏
  acceptChild?: boolean; // 是否接受子节点
  exportActions?: string[]; // 对外暴露的方法名
  defaultStyle?: React.CSSProperties; // 默认样式
}

export interface ElementInfo {
  element: Element;
  position: DOMRect;
}

export interface SchemaElements {
  id: string;
  label: string;
  element: Element;
  position: DOMRect;
}

// loop node types
export type LoopNode=LoopContainerNode;

export type LoopNodeConf={
  iterableState: PlainState;
  loopKey: string;
  toProps: string; // func body
}

export type ComposedNodeConf={
  iterableState: PlainState;
  loopKey: string;
  node: PageNode;
}
