import React, { useCallback } from 'react';
import type { BlockItemProps } from '@one-for-all/artery-engine';
import { mergeRight, omit } from 'ramda';

import type { BlocksCommunicationType } from '@pageDesign/types';
import TypeList from './type-list';

import './index.scss';

function Menu(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { sharedState, onSharedStateChange, onUpdateLayer } = props;

  const onTypeSelect = useCallback((type: string): void => {
    onSharedStateChange('menu.currentGroupType', type);
    onUpdateLayer({ layerId: type, name: 'hide', value: false });
  }, [onSharedStateChange]);

  const initBlockStates = useCallback((names: string[]) => {
    const block = names.reduce((acc, name) => ({ ...acc, [name]: { clickOutsideWhiteList: new Set() } }), {});
    onSharedStateChange('block', mergeRight(block, sharedState.block));
  }, [onSharedStateChange, sharedState]);

  const cleanBlockStates = useCallback((names: string[]) => {
    onSharedStateChange('block', omit(names, sharedState.block));
  }, [onSharedStateChange, sharedState]);

  return (
    <TypeList
      current={sharedState.menu?.currentGroupType}
      onClick={onTypeSelect}
      blockStates={sharedState.block}
      initBlockStates={initBlockStates}
      cleanBlockStates={cleanBlockStates}
    />
  );
}

export default Menu;
