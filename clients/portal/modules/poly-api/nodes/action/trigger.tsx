import React, { forwardRef, useRef, ForwardedRef } from 'react';
import cs from 'classnames';

import Action from './index';
import { mergeRefs } from '@portal/modules/poly-api/utils';

interface Props {
  type: 'right' | 'bottom';
  id: string;
  isCondition: boolean;
}

function NodeActionTrigger({ type, id, isCondition }: Props, ref: ForwardedRef<HTMLDivElement | null>): JSX.Element {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);
  const baseClass = 'border-blue-600 w-8 h-8 border-1 rounded-full transition-all duration-240';

  function toggleAnimation(isAdd?: boolean): void {
    isAdd ? triggerRef.current?.classList.add('active') : triggerRef.current?.classList.remove('active');
  }

  function activeAnimation(): void {
    toggleAnimation(true);
  }

  function offAnimation(): void {
    (actionRef.current?.style.opacity === '0' || !actionRef.current?.style.opacity) && toggleAnimation(false);
  }

  function handleHideAction(e?: Event): void {
    if (e?.target === triggerRef.current) {
      return;
    }
    if (actionRef.current) {
      actionRef.current.style.opacity = '0';
      actionRef.current.style.pointerEvents = 'none';
    }
    toggleAnimation(false);
  }

  function handleShowAction(): void {
    if (actionRef.current) {
      actionRef.current.style.opacity = '1';
      actionRef.current.style.pointerEvents = 'auto';
    }
  }

  const style = type === 'right' ? {
    right: 4, marginRight: -8,
  } : {
    bottom: -4, marginTop: -8,
  };

  return (
    <div
      className={cs(baseClass, 'node-action-trigger cursor-pointer opacity-0')}
      style={style}
      onMouseEnter={activeAnimation}
      onMouseLeave={offAnimation}
      onClick={handleShowAction}
      ref={mergeRefs<HTMLDivElement>(ref, triggerRef)}
    >
      <Action
        position={type}
        ref={actionRef}
        onHide={handleHideAction}
        currentNodeId={id}
        isCondition={isCondition}
      />
    </div>
  );
}

export default forwardRef(NodeActionTrigger);
