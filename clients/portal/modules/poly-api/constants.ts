import { ArrowHeadType } from 'react-flow-renderer';

export const PLACEHOLDER_OPTION = [
  {
    label: '暂无api',
    value: '',
    path: '',
    children: undefined,
    isLeaf: true,
    disabled: true,
    method: '',
  },
];

export const POLY_DESIGN_CONFIG = {
  EDGE_COLOR: '#CBD5E1',
  BACKGROUND_COLOR: 'transparent',
  ARROW_HEAD_TYPE: ArrowHeadType.ArrowClosed,
  EDGE_TYPE: 'smart',
};

export const NODE_INIT_CONFIG_PARAMS = {
  currentNodeConfigParams: {
    schema: {},
    currentNode: undefined,
    onClose: undefined,
    configForm: null,
    excludedFields: [],
  },
};

export type NODE_TYPE_MAPPER_VALUE = {
  title: string;
  desc: string;
  doc: string;
}
export const NODE_TYPE_MAPPER: Record<POLY_API.PolyNodeType, NODE_TYPE_MAPPER_VALUE> = {
  if: {
    title: '判断',
    desc: '判断条件是否成立的逻辑运算',
    doc: '查看文档',
  },
  input: {
    title: '开始',
    desc: '配置遵循 Swagger 2.0 规范的请求参数，作为下一节点的输入',
    doc: '查看文档',
  },
  request: {
    title: '请求',
    desc: '为 API 必填参数配置运算公式',
    doc: '查看文档',
  },
  output: {
    title: '结束',
    desc: '定义整体编排的输出结果',
    doc: '查看文档',
  },
};

export const OPERATES_MAP = {
  '+': '加',
  '-': '减',
  '*': '乘',
  '/': '除',
  '()': '括号',
};

export const CONDITION_OPERATES_MAP = {
  '>': '大于',
  '<': '小于',
  '==': '等于',
  '<=': '小于等于',
  '>=': '大于等于',
  '!=': '不等于',
  '&&': '与',
  '||': '或',
  '()': '括号',
  '\'\'': '引号',
};

export const POLY_STATUS_MAP = {
  0: '未启用',
  1: '已启用',
};

export const PATH_TREE_AVAILABLE_NODE_TYPE = ['input', 'request'];
