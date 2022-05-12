import React, { useRef } from 'react';
import { Panel } from '@one-for-all/ui';
import { and } from 'ramda';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { GROUP_TITLE_MAP } from '@pageDesign/constants';
import { useClickOutSide } from '@pageDesign/hooks/use-click-outside';

import Core from './core';

const Pool = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const wrapperRef = useRef(null);
  const { sharedState, onSharedStateChange } = props;
  const { menu = {}, block } = sharedState;
  const { currentGroupType, groupTypeContentPinned, pannelWith } = menu;
  const isVisible = useRef(false);

  isVisible.current = currentGroupType === 'pool';

  useClickOutSide({
    callback: onClose,
    when: (target) => {
      const whiteListSet = block['pool']?.clickOutsideWhiteList ?? new Set();
      const whiteList = [...whiteListSet];
      return and(
        isVisible.current,
        and(!groupTypeContentPinned, !whiteList.some((el) => el.contains(target))),
      );
    },
    container: wrapperRef,
  });

  function onClose(): void {
    onSharedStateChange('menu.currentGroupType', '');
  }

  function togglePinned(): void {
    onSharedStateChange('menu.groupTypeContentPinned', !groupTypeContentPinned);
  }

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
        <Core />
      </Panel>
    </div>
  );
};

export default Pool;
