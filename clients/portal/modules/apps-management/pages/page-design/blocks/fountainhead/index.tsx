import React, { useCallback, useRef, useEffect } from 'react';
import { Panel } from '@one-for-all/ui';
import { and, when } from 'ramda';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useClickOutSide } from '@pageDesign/hooks/use-click-outside';

import { FountainheadContextProvider } from './context';
import Core from './core';

const Fountainhead = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { sharedState, onSharedStateChange } = props;
  const { menu = {}, block } = sharedState;
  const { currentGroupType, groupTypeContentPinned, pannelWith } = menu;
  const isVisible = useRef(false);

  isVisible.current = currentGroupType === 'fountainhead';

  const onClose = useCallback((): void => {
    onSharedStateChange('menu.currentGroupType', '');
  }, [onSharedStateChange]);

  useEffect(() => {
    when(
      (el) => and(currentGroupType !== 'fountainhead', !!el),
      () => setTimeout(() => wrapperRef.current!.style.visibility = 'visible', 300),
    )(wrapperRef.current);
  }, [currentGroupType]);

  const onHide = useCallback((): void => {
    if (wrapperRef.current) {
      wrapperRef.current.style.visibility = 'hidden';
    }
  }, []);

  useClickOutSide({
    callback: onClose,
    when: (target): boolean => {
      const whiteListSet = block['fountainhead']?.clickOutsideWhiteList ?? new Set();
      const whiteList = [...whiteListSet];
      return and(
        isVisible.current,
        and(!groupTypeContentPinned, !whiteList.some((el) => el.contains(target))),
      );
    },
    container: wrapperRef,
  });

  function togglePinned(): void {
    onSharedStateChange('menu.groupTypeContentPinned', !groupTypeContentPinned);
  }

  const onAddNode = useCallback((): void => {
    !groupTypeContentPinned && onSharedStateChange('menu.currentGroupType', '');
  }, [groupTypeContentPinned, onSharedStateChange]);

  return (
    <div ref={wrapperRef} style={{ pointerEvents: 'auto' }}>
      <Panel
        title={GROUP_TITLE_MAP[currentGroupType ?? '']}
        onClose={onClose}
        onPin={togglePinned}
        visible={isVisible.current}
        pinned={groupTypeContentPinned}
        width={pannelWith}
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
