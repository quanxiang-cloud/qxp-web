import React, { useEffect, useRef, useState } from 'react';
import ArterySimulator, { SimulatorRef } from '@one-for-all/artery-simulator';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { BlocksCommunicationType } from '../../types';
import isNodeSupportChildren from './is-node-support-children';
import pluginsSrc from 'REF:./plugins';

import './index.scss';

// // todo fixme
const __OVER_LAYER_COMPONENTS: Array<{ packageName: string; exportName: string }> = [
  { packageName: '@one-for-all/headless-ui', exportName: 'MediocreDialog' },
];

function SimulatorBlock(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange, activeNode, setActiveNode } = props;
  const [activeModalLayer, setActiveModalLayer] = useState<string | undefined>();
  const simulatorRef = useRef<SimulatorRef>(null);

  useEffect(() => {
    if (simulatorRef.current?.iframe?.contentWindow) {
      const subWin = simulatorRef.current?.iframe?.contentWindow;
      subWin.CONFIG = window.CONFIG;
      subWin.USER = window.USER;
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
      setActiveOverLayerNodeID={setActiveModalLayer}
      activeOverLayerNodeID={activeModalLayer}
      cssURLs={[window.PERSONALIZED_CONFIG.styleCssUrl]}
      overLayerComponents={__OVER_LAYER_COMPONENTS}
    />
  );
}

export default SimulatorBlock;
