import React from 'react';
import { Panel } from '@one-for-all/ui';
import { mergeRight } from 'ramda';
import { DndProvider } from 'react-dnd';
import type { BlockItemProps } from '@one-for-all/artery-engine';
import { HTML5Backend } from 'react-dnd-html5-backend';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useMenuPanel } from '@pageDesign/hooks';

import Core from './core';

const Structure = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const {
    ref,
    currentType,
    onPin,
    pinned,
    visible,
    panelWidth,
    onForceClose,
  } = useMenuPanel(mergeRight(props, { type: 'structure' }));

  return (
    <div ref={ref} style={{ pointerEvents: 'auto' }}>
      <Panel
        title={GROUP_TITLE_MAP[currentType ?? '']}
        onClose={onForceClose}
        onPin={onPin}
        visible={visible}
        pinned={pinned}
        width={panelWidth}
        closable
        pinnable
      >
        <DndProvider backend={HTML5Backend}>
          <Core />
        </DndProvider>
      </Panel>
    </div>
  );
};

export default Structure;
