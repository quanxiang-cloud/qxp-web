import React, { useState } from 'react';
import ArterySimulator from '@one-for-all/artery-simulator';
import { Node } from '@one-for-all/artery';
import { nanoid } from 'nanoid';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { BlocksCommunicationType } from '../../types';
import plugins from './plugins';
import isNodeSupportChildren from './is-node-support-children';
import './index.scss';

// todo replace by artery-engine's implementation
function genNodeID(): string {
  return nanoid();
}

function SimulatorBlock({ schema, onChange }: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const [activeNode, setActiveNode] = useState<Node>();

  return (
    <ArterySimulator
      artery={schema}
      plugins={plugins}
      onChange={onChange}
      activeNode={activeNode}
      setActiveNode={setActiveNode}
      genNodeID={genNodeID}
      isNodeSupportChildren={isNodeSupportChildren}
    />
  );
}

export default SimulatorBlock;
