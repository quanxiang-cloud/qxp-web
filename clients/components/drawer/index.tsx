import React, { useState, isValidElement, useEffect } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import './index.scss';

type Props = {
  onCancel: () => boolean | void;
  title: string | JSX.Element;
  children: React.ReactNode;
  distanceTop?: number;
  className?: string;
}

// todo fix unmount update error
function Drawer({ onCancel, title, children, className, distanceTop = 56 }: Props): JSX.Element {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  let timeID = -1;

  const handleCancel = (): void => {
    onCancel();
    setBeganClose(true);
    timeID = window.setTimeout(() => {
      setVisible(true);
    }, 300);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeID);
    };
  }, []);

  return (
    <div
      className={cs('drawer-modal-mask', {
        'drawer-began-close': beganClose,
        'drawer-close': visible,
      }, className)}
    >
      <div
        style={{ '--distanceTop': distanceTop + 'px' } as React.CSSProperties}
        className='drawer-container'
      >
        <div className='drawer-header header-background-image'>
          {typeof title === 'string' && (
            <span className='text-h5'>{title}</span>
          )}
          {isValidElement(title) && title }
          <Icon onClick={handleCancel} clickable changeable name='close' size={24} />
        </div>
        <div className='drawer-main-content'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
