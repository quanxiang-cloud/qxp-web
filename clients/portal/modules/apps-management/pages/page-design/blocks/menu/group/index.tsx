import React, { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { and, when } from 'ramda';

import type { BlockItemProps } from '@one-for-all/artery-engine';
import type { BlocksCommunicationType } from '@pageDesign/types';

import TypeList from './type-list';
import TypeContent from './type-content';

const Group = (props: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const { sharedState, onSharedStateChange } = props;
  const { currentGroupType = '', groupTypeContentPinned = false, pannelWith } = sharedState.menu || {};
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((ev: MouseEvent): void => {
    const notClickInPannel = (el: HTMLDivElement | null): boolean => !el?.contains(ev.target as Node);
    const isNotPinned = (): boolean => !groupTypeContentPinned;
    when(
      (el: HTMLDivElement | null) => and(notClickInPannel(el), isNotPinned()),
      () => setCurrent(''),
    )(panelRef.current);
  }, [groupTypeContentPinned]);

  useEffect(() => {
    const onClickOut = debounce(handleClickOutside, 100);
    document.addEventListener('click', onClickOut);
    return () => {
      document.removeEventListener('click', onClickOut);
    };
  }, [handleClickOutside]);

  function setCurrent(current: string): void {
    onSharedStateChange('menu.currentGroupType', current);
  }

  function onAddNode(): void {
    !groupTypeContentPinned && onSharedStateChange('menu.currentGroupType', '');
  }

  return (
    <div className='flex relative h-full' ref={panelRef}>
      <TypeList current={currentGroupType} onClick={setCurrent} />
      <TypeContent
        width={pannelWith}
        current={currentGroupType}
        pinned={groupTypeContentPinned}
        onClose={() => setCurrent('')}
        togglePinned={() => onSharedStateChange('menu.groupTypeContentPinned', !groupTypeContentPinned)}
        onAddNode={onAddNode}
      />
    </div>
  );
};

export default Group;
