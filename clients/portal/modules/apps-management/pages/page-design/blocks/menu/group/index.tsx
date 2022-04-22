import React, { useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

import useObservable from '@lib/hooks/use-observable';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import TypeList from './type-list';
import TypeContent from './type-content';
import type { BlocksCommunicationType } from '../../../types';
import { updateBlocksCommunicationState } from '../../../utils/state';

const Group = ({ blocksCommunicationState$ }: BlockItemProps<BlocksCommunicationType>): JSX.Element => {
  const state = useObservable<BlocksCommunicationType>(
    // @ts-ignore
    blocksCommunicationState$,
    { activeNodeID: '', menu: { currentGroupType: '', groupTypeContentPinned: false } },
  );
  const { currentGroupType = '', groupTypeContentPinned = false, pannelWith } = state.menu || {};

  const panelRef = useRef<HTMLDivElement>(null);
  const hoverDoc = useCallback(debounce(handleClickOutside, 100), []);
  useEffect(() => {
    document.addEventListener('click', hoverDoc);
    return () => {
      document.removeEventListener('click', hoverDoc);
    };
  }, []);

  function handleClickOutside(ev: any): void {
    if (!panelRef.current?.contains(ev.target) && !groupTypeContentPinned) {
      setCurrent('');
    }
  }

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
