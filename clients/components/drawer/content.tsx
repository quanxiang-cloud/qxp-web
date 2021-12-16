import React, { isValidElement } from 'react';

import Icon from '@c/icon';

import './index.scss';

type Props = {
  onCancel: () => boolean | void;
  title: string | JSX.Element;
  children: React.ReactNode;
  distanceTop: number;
}

export default function Content({
  onCancel,
  title,
  children,
  distanceTop,
}: Props): JSX.Element | null {
  return (
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
  );
}
