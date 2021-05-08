import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

interface Props {
  iconName: string;
  text: string;
  onClick: () => void;
  isActive: boolean;
}

export default function AsideMenuItem({ iconName, text, onClick, isActive }: Props) {
  return (
    <div className={cs('flex items-center py-16 pl-24 pr-100', {
      'bg-blue-100': isActive,
    })} onClick={onClick}>
      <Icon name={iconName} className={cs('mr-8 group-hover:text-blue-600', {
        'text-blue-600': isActive,
      })} />
      <span
        className={cs(
          'text-body2-no-color-weight group-hover:text-blue-600 group-hover:font-medium', {
            'text-blue-600': isActive,
            'font-medium': isActive,
            'text-gray-900': !isActive,
            'font-normal': !isActive,
          }, 'whitespace-nowrap')}
      >
        {text}
      </span>
    </div>
  );
}
