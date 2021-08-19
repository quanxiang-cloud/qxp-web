import React, { isValidElement } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import '@c/drawer/index.scss';

type Props = {
  onCancel: () => boolean | void;
  title: string | JSX.Element;
  children: React.ReactNode;
  distanceTop?: number;
  className?: string;
}

function Drawer({ onCancel, title, children, className, distanceTop = 56 }: Props): JSX.Element {
  return (
    <div
      className={cs('drawer-modal-mask drawer-position-right', className)}
    >
      <div
        style={{ '--distanceTop': distanceTop + 'px' } as React.CSSProperties}
        className='drawer-container'
      >
        <div className='drawer-header header-background-image'>
          {typeof title === 'string' && (
            <span className='text-h5'>{title}</span>
          )}
          {isValidElement(title) && <>{ title }</>}
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
