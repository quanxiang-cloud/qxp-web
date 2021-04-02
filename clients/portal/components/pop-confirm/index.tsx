import React, { useRef, cloneElement, isValidElement } from 'react';

import { Placement } from '@popperjs/core';
import Button from '../button';
import Popper from '../popper';

import './index.scss';

type Props = {
  children: React.ReactElement;
  content: React.ReactNode;
  footer?: React.ReactNode;
  cancelText?: string;
  okText?: string;
  placement?: Placement
  onCancel?: () => void;
  onOk?: () => void;
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
  footer,
  onCancel,
  onOk,
  cancelText = '取消',
  okText = '确定',
}: Props) {
  const popperRef = useRef<Popper>(null);
  const reference = React.useRef<any>(null);

  const handleCancel = () => {
    onCancel&&onCancel();
    popperRef.current.close();
  };

  const handleOk = () => {
    onOk && onOk();
    popperRef.current.close();
  };

  const isElement = isValidElement(children);

  return (
    <>
      {isElement ?
        cloneElement(children, { ref: reference }) :
        <span ref={reference}>{children}</span>
      }
      <Popper
        ref={popperRef}
        reference={reference}
        onVisibilityChange={onVisibilityChange}
        placement={placement || 'bottom-start'}
        modifiers={modifiers}
      >
        <div className='pop-confirm-content'>
          {content}
          {isValidElement(footer) ? footer : (
            <div className='pop-confirm-content-btn-box'>
              <Button
                onClick={handleCancel}
                className='pop-confirm-content-btn-cancel'
              >
                {cancelText}
              </Button>
              <Button onClick={handleOk} className='pop-confirm-content-btn-ok'>{okText}</Button>
            </div>
          )}
        </div>
      </Popper>
    </>
  );
}

export default PopConfirm;
