import React, { useState, MouseEvent } from 'react';
import cs from 'classnames';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';

import Icon from '@c/icon';
import store, { updateStore } from '@flow/content/editor/store';
import type { StoreValue } from '@flow/content/editor/type';
import useObservable from '@lib/hooks/use-observable';
import { onRemoveNode } from '@flow/content/editor/utils';

import ActionButtonGroup from './action-button-group';

interface Props {
  id: string;
  type?: 'dark' | 'primary' | 'light';
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

export default function NodeRemover({
  id, type = 'dark', visible = true, onVisibilityChange,
}: Props): JSX.Element | null {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { status, elements } = useObservable<StoreValue>(store);
  const [referenceElRef, setReferenceElRef] = useState(null);
  const [popperElRef, setPopperElRef] = useState(null);
  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [-18, 0] } }],
    placement: 'bottom-start',
  });
  useClickAway({ current: popperElRef }, () => {
    setShowRemoveModal(false);
  }, ['mousedown', 'touchstart', 'click']);

  function handleOnSubmitRemoveNode(): void {
    const newElements = onRemoveNode(id, elements);
    updateStore((s) => ({ ...s, elements: newElements }));
  }

  function onMouseDown(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onMouseUp(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onShowRemovePopper(e: MouseEvent<SVGSVGElement>): void {
    e.stopPropagation();
    document.body.click();
    setShowRemoveModal(true);
  }

  function onClosePopper(): void {
    onVisibilityChange && onVisibilityChange(false);
    setShowRemoveModal(false);
  }

  if (status === 'ENABLE') {
    return null;
  }

  const shouldShow = visible || showRemoveModal;

  return (
    <>
      <Icon
        name="close"
        className={cs('transition-all absolute right-6 top-1/2 transform -translate-y-1/2', {
          'cursor-default': !shouldShow,
          'pointer-events-none': !shouldShow,
          'opacity-0': !shouldShow,
          'opacity-1': shouldShow,
          'cursor-pointer': shouldShow,
        })}
        type={type}
        onClick={onShowRemovePopper}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        ref={setReferenceElRef as any}
      />
      {showRemoveModal && (
        <div
          {...popperRef.attributes.popper}
          style={{
            ...popperRef.styles.popper,
            transform: 'none',
            left: 'calc(100% - 20px)',
            top: 25,
            boxShadow: '0 0 30px rgba(200, 200, 200, .7)',
          }}
          ref={setPopperElRef as any}
          className="bg-white z-50 rounded-8"
        >
          <div
            key="remove-tip"
            className="mb-16 pl-12 pt-12"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <Icon name="info" className="text-yellow-600" />
            <span className="text-yellow-600 ml-8">是否删除该节点</span>
          </div>
          <div
            className="pl-16"
            key="remove-action"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <ActionButtonGroup
              className="p-0"
              onCancel={onClosePopper}
              onSubmit={handleOnSubmitRemoveNode}
            />
          </div>
        </div>
      )}
    </>
  );
}
