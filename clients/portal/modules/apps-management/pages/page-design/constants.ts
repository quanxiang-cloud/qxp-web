import type { Artery } from '@one-for-all/artery';
import { Layer } from '@one-for-all/page-engine-v2';

import Header from './blocks/header';
import Menu from './blocks/menu';
import Canvas from './blocks/canvas';
import Config from './blocks/config';
import { BlocksCommunicationType } from './types';

export const INIT_SCHEMA_EDITOR_SCHEMA: Artery = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: { id: 'root', type: 'html-element', name: 'div' },
};

export const QUERY_KEY = {
  SCHEMA: 'QUERY_SCHEMA',
};

export const PAGE_TYPE = {
  SCHEMA_EDITOR: 'schema_editor',
  PAGE_DESIGN_EDITOR: 'page_engine',
};

export const PAGE_DESIGN_ID = 'page-design-container';

export const LAYERS: Layer<BlocksCommunicationType>[] = [{
  gridTemplateColumns: '1fr 21fr 5fr',
  gridTemplateRows: 'minmax(41px, 1fr) 10fr',
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
