import React, { useRef, cloneElement, isValidElement } from 'react';
import { Placement } from '@popperjs/core';
import Button from '../button';
import Popper from '../popper';

type Props = {
  children: React.ReactElement;
  content: React.ReactNode;
  cancelText?: string;
  okText?: string;
  placement?: Placement;
  onCancel?: () => void;
  onOk?: () => (void | Promise<any>);
  onVisibilityChange?: (visible: boolean) => void;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function PopConfirm({
  placement,
  onVisibilityChange,
  children,
  content,
  onCancel,
  onOk,
  cancelText = '取消',
  okText = '确定',
}: Props ): JSX.Element {
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);

  const handleCancel = (): void => {
    onCancel && onCancel();
    popperRef.current?.close();
  };

  const handleOk = (): void => {
    if (onOk instanceof Promise) {
      (onOk() as Promise<any>).then(() => {
        popperRef.current?.close();
      });
      return;
    }

    onOk && onOk();
    popperRef.current?.close();
  };

  const isElement = isValidElement(children);

  return (
    <>
      {isElement ?
        cloneElement(children as React.ReactElement, { ref: reference }) :
        <span ref={reference}>{children}</span>
      }
      <Popper
        ref={popperRef}
        reference={reference}
        onVisibilityChange={onVisibilityChange}
        placement={placement || 'bottom-start'}
        modifiers={modifiers}
      >
        <div className="pop-confirm-content">
          {content}
          <div className='pop-confirm-content-btn-box'>
            <Button
              onClick={handleCancel}
              className='pop-confirm-content-btn-cancel'
            >
              {cancelText}
            </Button>
            <Button onClick={handleOk} className='pop-confirm-content-btn-ok'>{okText}</Button>
          </div>
        </div>
      </Popper>
    </>
  );
}

export default PopConfirm;
