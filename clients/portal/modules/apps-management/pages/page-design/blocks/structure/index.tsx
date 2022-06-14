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
import { useOutlineRootNode } from './hooks';
import LayerSwitcher from './layer-switcher';

function Structure(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange, activeNode, setActiveNode } = props;
  const { getNodePropsSpec } = useContext(FountainContext);
  const { ref, currentType, onPin, pinned, visible, panelWidth, onForceClose } = useMenuPanel(
    mergeRight(props, { type: 'structure' }),
  );

  const { rootNode, onChangeNode } = useOutlineRootNode(artery, onChange);

  function isContainer(node: NodePrimary): boolean {
    return !!getNodePropsSpec(node)?.isContainer;
  }

  if (!rootNode) {
    return (
      <div
        ref={ref}
        style={{ pointerEvents: 'auto' }}
        // prevent panel collapse when interacting with outline
        onClick={(e) => e.stopPropagation()}
      >
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
          缺少根结点
        </Panel>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ pointerEvents: 'auto' }}
      // prevent panel collapse when interacting with outline
      onClick={(e) => e.stopPropagation()}
    >
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
        <LayerSwitcher
          artery={artery}
          onChange={onChange}
          activeLayer={props.sharedState.activeModalLayer || ''}
          onActiveModalLayerChange={(activeModalLayer) => {
            props.onSharedStateChange('activeModalLayer', activeModalLayer);
          }}
        />
        <ArteryOutline
          rootNode={rootNode}
          isContainer={isContainer}
          onChange={onChangeNode}
          activeNode={activeNode}
          onActiveNodeChange={setActiveNode}
        />
      </Panel>
    </div>
  );
}

export default Structure;
