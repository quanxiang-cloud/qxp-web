import React from 'react';
import { Panel } from '@one-for-all/ui';
import { mergeRight } from 'ramda';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useMenuPanel } from '@pageDesign/hooks';

import Core from './core';

const Pool = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const {
    ref,
    currentType,
    onPin,
    pinned,
    visible,
    panelWidth,
    onForceClose,
  } = useMenuPanel(mergeRight(props, { type: 'pool' }));

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
        <Core />
      </Panel>
    </div>
  );
};

export default Pool;
