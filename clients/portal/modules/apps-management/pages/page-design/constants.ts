import { Layer } from '@one-for-all/artery-engine';

import Header from './blocks/header';
import Menu from './blocks/menu';
// import Canvas from './blocks/canvas';
import Simulator from './blocks/simulator';
import Config from './blocks/node-carve';
import { BlocksCommunicationType } from './types';

export const QUERY_KEY = {
  ARTERY: 'QUERY_ARTERY',
};

export const PAGE_DESIGN_ID = 'page-design-container';

export const LAYERS: Layer<BlocksCommunicationType>[] = [
  {
    gridTemplateColumns: '56px 1fr 282px',
    gridTemplateRows: '44px calc(100vh - 44px)',
    blocks: [
      {
        gridColumnStart: 'span 3',
        render: Header,
      },
      {
        render: Menu,
      },
      {
        render: Simulator,
      },
      {
        render: Config,
      },
    ],
    blocksCommunicationStateInitialValue: { },
  },
];

export const SYSTEM_COMPONENT_NAMES = ['UserMenuAvatar', 'SystemTaskList', 'FileUpload'];
