import type { Artery } from '@one-for-all/artery';
import { Layer } from '@one-for-all/artery-engine';

import Header from './blocks/header';
import Menu from './blocks/menu';
import Canvas from './blocks/canvas';
import Config from './blocks/config';
import { BlocksCommunicationType } from './types';

export const INIT_ARTERY_EDITOR_ARTERY: Artery = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: { id: 'root', type: 'html-element', name: 'div' },
};

export const QUERY_KEY = {
  ARTERY: 'QUERY_ARTERY',
};

export const PAGE_TYPE = {
  ARTERY_EDITOR: 'artery_editor',
  PAGE_DESIGN_EDITOR: 'page_engine',
};

export const PAGE_DESIGN_ID = 'page-design-container';

export const LAYERS: Layer<BlocksCommunicationType>[] = [{
  gridTemplateColumns: '56px 1fr 282px',
  gridTemplateRows: '44px calc(100vh - 44px)',
  blocks: [{
    gridColumnStart: 'span 3',
    render: Header,
  }, {
    render: Menu,
  }, {
    render: Canvas,
  }, {
    render: Config,
  }],
  blocksCommunicationStateInitialValue: { activeNodeID: '' },
}];
