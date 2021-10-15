import React, { PropsWithChildren, useRef } from 'react';
import cs from 'classnames';

import ActionTrigger from './action/trigger';
import { isSomeActionShow } from '../utils';

type Props = PropsWithChildren<{
  bottomTrigger?: boolean,
  rightTrigger?: boolean,
  noPadding?: boolean,
  isSelected: boolean,
}>;

export default function({
  children, bottomTrigger, rightTrigger, noPadding, isSelected,
}: Props): JSX.Element {
  const nodeWrapperRef = useRef<HTMLElement | null>(null);
  const rightTriggerRef = useRef<HTMLDivElement | null>(null);
  const bottomTriggerRef = useRef<HTMLDivElement | null>(null);

  function setSectionParentIndex(zIndex: string): void {
    if (!nodeWrapperRef.current?.parentElement) {
      return;
    }
    nodeWrapperRef.current.parentElement.style.zIndex = zIndex;
  }

  function handleMouseEnter(): void {
    if (rightTriggerRef.current) {
      rightTriggerRef.current.style.opacity = '1';
    }
    if (bottomTriggerRef.current) {
      bottomTriggerRef.current.style.opacity = '1';
    }
    setSectionParentIndex('10');
  }

  function handleMouseLeave(): void {
    if (isSomeActionShow(nodeWrapperRef.current)) {
      return;
    }
    if (rightTriggerRef.current) {
      rightTriggerRef.current.style.opacity = '0';
    }
    if (bottomTriggerRef.current) {
      bottomTriggerRef.current.style.opacity = '0';
    }
    !isSelected && setSectionParentIndex('3');
  }

  return (
    <section
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center"
      ref={nodeWrapperRef}
    >
      <div className="flex flex-1 flex-col items-center">
        <header className="error-msg"></header>
        <footer
          className={cs('relative flex flex-col justify-center items-center bg-white rounded-8', {
            'px-12 py-6': !noPadding,
          })}
        >
          {children}
        </footer>
        {bottomTrigger && <ActionTrigger ref={bottomTriggerRef} type="bottom" />}
      </div>
      {rightTrigger && <ActionTrigger ref={rightTriggerRef} type="right" />}
    </section>
  );
}
