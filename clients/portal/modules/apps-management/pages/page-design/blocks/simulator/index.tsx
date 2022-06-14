import React, { useContext, useEffect, useRef } from 'react';
import ArterySimulator, { SimulatorRef } from '@one-for-all/artery-simulator';
import { BlockItemProps } from '@one-for-all/artery-engine';

import { BlocksCommunicationType } from '../../types';
import pluginsSrc from 'REF:./plugins';

import './index.scss';
import FountainContext from '../../fountain-context';
import { NodePrimary } from '@one-for-all/artery-simulator/lib/types';

// todo fixme
const __OVER_LAYER_COMPONENTS: Array<{ packageName: string; exportName: string }> = [
  { packageName: '@one-for-all/headless-ui', exportName: 'MediocreDialog' },
];

function SimulatorBlock(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange, activeNode, setActiveNode } = props;
  const simulatorRef = useRef<SimulatorRef>(null);
  const { getNodePropsSpec } = useContext(FountainContext);

  function isContainer(node: NodePrimary): boolean {
    return !!getNodePropsSpec(node)?.isContainer;
  }

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
      isContainer={isContainer}
      // todo optimize this
      setActiveOverLayerNodeID={(activeModalLayer) => {
        props.onSharedStateChange('activeModalLayer', activeModalLayer);
      }}
      activeOverLayerNodeID={props.sharedState.activeModalLayer}
      cssURLs={[window.PERSONALIZED_CONFIG.styleCssUrl]}
      overLayerComponents={__OVER_LAYER_COMPONENTS}
    />
  );
}

export default SimulatorBlock;
