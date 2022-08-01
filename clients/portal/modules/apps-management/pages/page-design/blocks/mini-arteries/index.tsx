import React from 'react';
import { BlockItemProps } from '@one-for-all/artery-engine';
import { Panel } from '@one-for-all/ui';
import { mergeRight } from 'ramda';

import { BlocksCommunicationType } from '../../types';
import { useMenuPanel } from '../../hooks';
import { GROUP_TITLE_MAP } from '../../constants';
import { ActiveNodeCtx } from './utils';
import MiniArteriesCore from './core';

import './index.scss';

function MiniArteries(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { ref, currentType, onPin, pinned, visible, panelWidth, onForceClose } = useMenuPanel(
    mergeRight(props, { type: 'miniArteries' }),
  );

  return (
    <div ref={ref} style={{ pointerEvents: 'auto' }}>
      <Panel
        closable
        pinnable
        title={GROUP_TITLE_MAP[currentType ?? '']}
        onClose={onForceClose}
        onPin={onPin}
        visible={visible}
        pinned={pinned}
        width={panelWidth}
      >
        <ActiveNodeCtx.Provider value={props.activeNode}>
          <MiniArteriesCore />
        </ActiveNodeCtx.Provider>
      </Panel>
    </div>
  );
}

export default MiniArteries;
