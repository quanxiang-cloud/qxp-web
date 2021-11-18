import React from 'react';
import {
  Background,
  BackgroundVariant,
  MiniMap,
} from 'react-flow-renderer';

import Control from './control';

export default function ToolBar(): JSX.Element {
  return (
    <>
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={0.5}
      />
      <MiniMap
        nodeColor={(node) => {
          switch (node.type) {
          case 'input':
            return 'red';
          case 'default':
            return '#00ff00';
          case 'output':
            return 'rgb(0,0,255)';
          default:
            return '#eee';
          }
        }}
        nodeStrokeWidth={3}
      />
      <Control className="left-16 top-16 right-16 flex absolute z-10" />
    </>
  );
}
