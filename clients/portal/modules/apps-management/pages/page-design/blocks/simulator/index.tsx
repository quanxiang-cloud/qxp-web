import React, { useState } from 'react';
import ArterySimulator from '@one-for-all/artery-simulator';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { BlocksCommunicationType } from '../../types';
import isNodeSupportChildren from './is-node-support-children';
import './index.scss';
import isNodeInModalLayer from './is-node-modal-root';
import { Node } from '@one-for-all/artery';

function SimulatorBlock(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange } = props;
  const [activeNode, setActiveNode] = useState<Node>();
  const [activeModalLayer, setActiveModalLayer] = useState<string | undefined>();

  return (
    <ArterySimulator
      className="artery-simulator"
      artery={artery}
      pluginsSrc='/dist/TEMPORARY_PATCH_FOR_ARTERY_PLUGINS.js'
      onChange={onChange}
      activeNode={activeNode}
      setActiveNode={setActiveNode}
      isNodeSupportChildren={isNodeSupportChildren}
      isNodeInModalLayer={isNodeInModalLayer}
      setActiveModalLayer={setActiveModalLayer}
      activeModalLayer={activeModalLayer}
    />
  );
}

export default SimulatorBlock;
