import React from 'react';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';

import styles from './style.m.scss';

export interface TypeItemProps {
  icon: string;
  name: string;
  label: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

function TypeItem({ active, className, onClick, icon, label }: TypeItemProps): JSX.Element {
  const cls = cs('flex flex-col items-center mb-20 cursor-pointer', {
    [styles.active]: active,
  }, styles.group, className);

  return (
    <div
      className={cls}
      onClick={onClick}
    >
      <Icon name={icon} color='gray' clickable changeable />
      <p className='text-gray-600 text-10'>{label}</p>
    </div>
  );
}

export default TypeItem;
