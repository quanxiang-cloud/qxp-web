import React, { useState } from 'react';
import { Placement } from '@popperjs/core';

import Button from '@c/button';
import Popover from '@c/popover';

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

function PopConfirm({
  placement,
  onVisibilityChange,
  children,
  content,
  onCancel,
  onOk,
  cancelText = '取消',
  okText = '确定',
}: Props): JSX.Element {
  const [visible, setVisible] = useState(false);

  const handleCancel = (): void => {
    onCancel && onCancel();
    setVisible(false);
  };

  const handleOk = (): void => {
    if (onOk instanceof Promise) {
      (onOk() as Promise<any>).then(() => {
        setVisible(false);
      });
      return;
    }

    onOk && onOk();
    setVisible(false);
  };

  const handleVisibilityChange = (flag: boolean): void => {
    setVisible(flag);
    onVisibilityChange?.(flag);
  };

  return (
    <>
      <Popover
        onVisibilityChange={handleVisibilityChange}
        open={visible}
        placement={placement || 'bottom-start'}
        content={(
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
        )}
      >
        {children}
      </Popover>
    </>
  );
}

export default PopConfirm;
