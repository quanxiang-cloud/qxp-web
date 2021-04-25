import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import './index.scss';

type Props = {
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
  distanceTop?: number;
}

function Drawer({ onCancel, title, children, distanceTop = 56 }: Props) {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const handleCancel = () => {
    setBeganClose(true);
    setTimeout(() => {
      setVisible(true);
      onCancel();
    }, 300);
  };

  return (
    <div
      className={cs('drawer-modal-mask', {
        'drawer-began-close': beganClose,
        'drawer-close': visible,
      })}
    >
      <div
        style={{ '--distanceTop': distanceTop + 'px' } as React.CSSProperties}
        className='drawer-container'
      >
        <div className='drawer-header header-background-image'>
          <span className='text-h5'>{title}</span>
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
