import React, { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { and, when } from 'ramda';

import useObservable from '@lib/hooks/use-observable';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import TypeList from './type-list';
import TypeContent from './type-content';
import type { BlocksCommunicationType } from '../../../types';
import { updateBlocksCommunicationState } from '../../../utils/state';

const Group = ({ blocksCommunicationState$ }: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const panelRef = useRef<HTMLDivElement>(null);
  const state = useObservable<BlocksCommunicationType>(
    blocksCommunicationState$ as any,
    { activeNodeID: '', menu: { currentGroupType: '', groupTypeContentPinned: false } },
  );
  const { currentGroupType = '', groupTypeContentPinned = false, pannelWith } = state.menu || {};

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

  function updateState<T>(path: string, value: T): void {
    updateBlocksCommunicationState<T>({ state: blocksCommunicationState$, path, value });
  }

  function setCurrent(current: string): void {
    updateState<string>('menu.currentGroupType', current);
  }

  function onAddNode(): void {
    !groupTypeContentPinned && updateState('menu.currentGroupType', '');
  }

  return (
    <div className='flex relative h-full' ref={panelRef}>
      <TypeList current={currentGroupType} onClick={setCurrent} />
      <TypeContent
        width={pannelWith}
        current={currentGroupType}
        pinned={groupTypeContentPinned}
        onClose={() => setCurrent('')}
        togglePinned={() => updateState<boolean>('menu.groupTypeContentPinned', !groupTypeContentPinned)}
        onAddNode={onAddNode}
      />
    </div>
  );
};

export default Group;
