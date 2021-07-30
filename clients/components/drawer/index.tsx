import React, { useState, isValidElement } from 'react';
import { useUpdateEffect } from 'react-use';
import cs from 'classnames';

import Icon from '@c/icon';

import './index.scss';

type Props = {
  onCancel: () => boolean | void;
  title: string | JSX.Element;
  children: React.ReactNode;
  distanceTop?: number;
  className?: string;
  visible: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

function Drawer({
  onCancel,
  title,
  children,
  className,
  position = 'bottom',
  visible,
  distanceTop = 56,
}: Props): JSX.Element | null {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [contentShow, setContentShow] = useState(visible);

  let timeID = -1;

  useUpdateEffect(() => {
    if (visible === false) {
      setBeganClose(true);
      timeID = window.setTimeout(() => {
        setContentShow(false);
      }, 300);
    } else {
      setBeganClose(false);
      setContentShow(true);
    }
    return () => {
      clearTimeout(timeID);
    };
  }, [visible]);

  if (!contentShow) {
    return null;
  }

  return (
    <div
      className={cs(`drawer-modal-mask drawer-position-${position}`, {
        'drawer-began-close': beganClose,
        'drawer-close': !contentShow,
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
          {isValidElement(title) && title}
          <Icon onClick={onCancel} clickable changeable name='close' size={24} />
        </div>
        <div className='drawer-main-content'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
