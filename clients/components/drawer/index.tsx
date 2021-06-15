import React, { useState, isValidElement, useRef, useEffect } from 'react';
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

function Drawer({ onCancel, title, children, className, distanceTop = 56 }: Props) {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);
  const paneRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    if (isUnmounted) {
      return;
    }
    const isOk = onCancel();
    if (isOk !== false) {
      setBeganClose(true);
      setTimeout(() => {
        setVisible(true);
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      setIsUnmounted(true);
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
        ref={paneRef}
        style={{ '--distanceTop': distanceTop + 'px' } as React.CSSProperties}
        className='drawer-container'
      >
        <div className='drawer-header header-background-image'>
          {typeof title === 'string' && (
            <span className='text-h5'>{title}</span>
          )}
          {isValidElement(title) && (
            <>
              { title }
            </>
          )}
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
