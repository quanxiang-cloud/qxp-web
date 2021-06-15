import React, { useState, MouseEvent } from 'react';
import cs from 'classnames';
import { usePopper } from 'react-popper';

import Icon from '@c/icon';
import store, { removeNodeById } from '@flow/detail/content/editor/store';
import type { StoreValue } from '@flow/detail/content/editor/type';
import useObservable from '@lib/hooks/use-observable';
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
  const { status } = useObservable<StoreValue>(store);
  const [referenceElRef, setReferenceElRef] = useState(null);
  const [popperElRef, setPopperElRef] = useState(null);
  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [-18, 0] } }],
    placement: 'bottom-start',
  });

  function onRemoveNode(): void {
    removeNodeById(id);
  }

  function onMouseDown(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onMouseUp(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onShowRemovePopper(e: MouseEvent<SVGSVGElement>): void {
    e.stopPropagation();
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
          style={popperRef.styles.popper}
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
              onSubmit={onRemoveNode}
            />
          </div>
        </div>
      )}
    </>
  );
}
