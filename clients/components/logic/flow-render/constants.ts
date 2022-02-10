import { SmartEdgeOptions } from '@tisoap/react-flow-smart-edge';

export const NODE_TYPE_MINIMAP_COLOR_MAP = {
  input: 'red',
  default: '#00ff00',
  output: 'rgb(0,0,255)',
  noMatch: '#eee',
};

export const SMART_EDGE_CONFIG: SmartEdgeOptions = {
  debounceTime: 200,
  nodePadding: 10,
  gridRatio: 10,
  lineType: 'straight',
  lessCorners: true,
};

interface DAGRE_LAYOUT_TYPE {
  right: 'LR';
  bottom: 'TB';
  nomatch: 'TB';
}
const DAGRE_LAYOUT: DAGRE_LAYOUT_TYPE = {
  right: 'LR',
  bottom: 'TB',
  nomatch: 'TB',
};

interface ELK_LAYOUT_TYPE {
  right: 'RIGHT';
  bottom: 'DOWN';
  nomatch: 'RIGHT';
}
const ELK_LAYOUT: ELK_LAYOUT_TYPE = {
  right: 'RIGHT',
  bottom: 'DOWN',
  nomatch: 'RIGHT',
};

export const LAYOUT_DIRECTION_MAP = {
  DAGRE: DAGRE_LAYOUT,
  ELK: ELK_LAYOUT,
};
