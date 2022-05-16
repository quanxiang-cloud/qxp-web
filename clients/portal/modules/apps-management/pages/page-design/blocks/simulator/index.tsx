import React, { useEffect, useRef, useState } from 'react';
import ArterySimulator, { SimulatorRef } from '@one-for-all/artery-simulator';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { BlocksCommunicationType } from '../../types';
import isNodeSupportChildren from './is-node-support-children';
import './index.scss';
// todo fixme
import pluginsSrc from 'dll:./../../../../../../../../tmp/TEMPORARY_PATCH_FOR_ARTERY_PLUGINS.js';

function SimulatorBlock(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange, activeNode, setActiveNode } = props;
  const [activeModalLayer, setActiveModalLayer] = useState<string | undefined>();
  const simulatorRef = useRef<SimulatorRef>(null);

  useEffect(() => {
    if (simulatorRef.current?.iframe?.contentWindow) {
      simulatorRef.current.iframe.contentWindow.CONFIG = window.CONFIG;
      simulatorRef.current.iframe.contentWindow.USER = window.USER;
    }
  }, []);

  return (
    <ArterySimulator
      ref={simulatorRef}
      className="artery-simulator"
      artery={artery}
      pluginsSrc={pluginsSrc}
      onChange={onChange}
      activeNode={activeNode}
      setActiveNode={setActiveNode}
      isNodeSupportChildren={isNodeSupportChildren}
      modalComponents={[{ packageName: '@one-for-all/headless-ui', exportName: 'MediocreDialog' }]}
      setActiveModalLayer={setActiveModalLayer}
      activeModalLayer={activeModalLayer}
    />
  );
}

export default SimulatorBlock;
