import { Layer } from '@one-for-all/artery-engine';
import React from 'react';

import Header from './blocks/header';
import Menu from './blocks/menu';
// import Canvas from './blocks/canvas';
import Simulator from './blocks/simulator';
import Fountainhead from './blocks/fountainhead';
import Structure from './blocks/structure';
import Pool from './blocks/pool';
import Config from './blocks/config';
import { BlocksCommunicationType } from './types';

export const QUERY_KEY = {
  ARTERY: 'QUERY_ARTERY',
};

export const PAGE_DESIGN_ID = 'page-design-container';

export const LAYERS: Layer<BlocksCommunicationType>[] = [
  {
    style: {
      gridTemplateColumns: '56px 1fr 282px',
      gridTemplateRows: '44px calc(100vh - 44px)',
    },
    blocks: [
      {
        style: {
          gridColumnStart: 'span 3',
        },
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
  },
  {
    id: 'fountainhead',
    style: {
      gridTemplateColumns: '56px 1fr 282px',
      gridTemplateRows: '44px calc(100vh - 44px)',
      pointerEvents: 'none',
    },
    hide: true,
    blocks: [
      {
        style: {
          gridColumnStart: 'span 3',
        },
        render: () => <div></div>,
      },
      {
        render: () => <div></div>,
      },
      {
        style: {
          position: 'relative',
        },
        render: Fountainhead,
      },
      {
        render: () => <div></div>,
      },
    ],
  },
  {
    id: 'structure',
    style: {
      gridTemplateColumns: '56px 1fr 282px',
      gridTemplateRows: '44px calc(100vh - 44px)',
      pointerEvents: 'none',
    },
    hide: true,
    blocks: [
      {
        style: {
          gridColumnStart: 'span 3',
        },
        render: () => <div></div>,
      },
      {
        render: () => <div></div>,
      },
      {
        style: {
          position: 'relative',
        },
        render: Structure,
      },
      {
        render: () => <div></div>,
      },
    ],
  },
  {
    id: 'pool',
    style: {
      gridTemplateColumns: '56px 1fr 282px',
      gridTemplateRows: '44px calc(100vh - 44px)',
      pointerEvents: 'none',
    },
    hide: true,
    blocks: [
      {
        style: {
          gridColumnStart: 'span 3',
        },
        render: () => <div></div>,
      },
      {
        render: () => <div></div>,
      },
      {
        style: {
          position: 'relative',
        },
        render: Pool,
      },
      {
        render: () => <div></div>,
      },
    ],
  },
];

export const GROUP_TITLE_MAP: { [key: string]: string } = {
  fountainhead: '平台组件库',
  templates: '区块模板',
  structure: '页面层级',
  pool: '数据源',
};
