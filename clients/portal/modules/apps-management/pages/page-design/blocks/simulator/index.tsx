import React from 'react';
import ArterySimulator from '@one-for-all/artery-simulator';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { BlocksCommunicationType } from '../../types';
import plugins from './plugins';
import isNodeSupportChildren from './is-node-support-children';
import './index.scss';

function SimulatorBlock(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange, generateNodeId, setActiveNode, activeNode } = props;

  return (
    <ArterySimulator
      artery={artery}
      plugins={plugins}
      onChange={onChange}
      activeNode={activeNode}
      setActiveNode={setActiveNode}
      genNodeID={generateNodeId}
      isNodeSupportChildren={isNodeSupportChildren}
    />
  );
}

export default SimulatorBlock;
