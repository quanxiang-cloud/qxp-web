import React, { useContext } from 'react';
import { Panel } from '@one-for-all/ui';
import { mergeRight } from 'ramda';
import type { BlockItemProps } from '@one-for-all/artery-engine';
import ArteryOutline from '@one-for-all/artery-outline';
import type { NodePrimary } from '@one-for-all/artery-outline/lib/types';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useMenuPanel } from '@pageDesign/hooks';
import FountainContext from '../../fountain-context';

function Structure(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange, activeNode, setActiveNode } = props;
  const { getNodePropsSpec } = useContext(FountainContext);
  const {
    ref,
    currentType,
    onPin,
    pinned,
    visible,
    panelWidth,
    onForceClose,
  } = useMenuPanel(mergeRight(props, { type: 'structure' }));

  function isContainer(node: NodePrimary): boolean {
    return !!getNodePropsSpec(node)?.isContainer;
  }

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
        {/* <Core
          artery={artery}
          activeNode={activeNode}
          onChange={onChange}
          setActiveNode={setActiveNode}
        /> */}
        <ArteryOutline
          rootNode={artery.node}
          isContainer={isContainer}
          onChange={(node) => onChange({ ...artery, node })}
          activeNode={activeNode}
          onActiveNodeChange={setActiveNode}
        />
      </Panel>
    </div>
  );
}

export default Structure;
