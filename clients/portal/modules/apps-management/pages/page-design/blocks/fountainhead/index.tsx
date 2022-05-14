import React, { useCallback, useEffect } from 'react';
import { Panel } from '@one-for-all/ui';
import { and, mergeRight, when } from 'ramda';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useMenuPanel } from '@pageDesign/hooks';

import { FountainheadContextProvider } from './context';
import Core from './core';

const Fountainhead = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const {
    ref,
    currentType,
    onClose,
    onPin,
    pinned,
    onSharedStateChange,
    visible,
    panelWidth,
    onForceClose,
  } = useMenuPanel(mergeRight(props, { type: 'fountainhead' }));

  useEffect(() => {
    const resetWrapperVisibility = (): string => ref.current!.style.visibility = 'visible';
    when(
      (el) => and(and(currentType !== 'fountainhead', !!el), !pinned),
      () => setTimeout(resetWrapperVisibility, 300),
    )(ref.current);
  }, [currentType, pinned]);

  const onHide = useCallback((): void => {
    if (ref.current && !pinned) {
      ref.current.style.visibility = 'hidden';
    }
  }, [pinned]);

  const onAddNode = useCallback((): void => {
    !pinned && onSharedStateChange('menu.currentType', '');
  }, [pinned, onSharedStateChange]);

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
        <FountainheadContextProvider onPanelHide={onHide} onPanelClose={onClose}>
          <Core onAddNode={onAddNode} />
        </FountainheadContextProvider>
      </Panel>
    </div>
  );
};

export default Fountainhead;
