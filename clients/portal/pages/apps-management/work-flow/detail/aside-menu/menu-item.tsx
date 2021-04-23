import React from 'react';
import classnames from 'classnames';

import Icon from '@c/icon';

interface Props {
  iconName: string;
  text: string;
  onClick: () => void;
  isActive: boolean;
}

export default function AsideMenuItem({ iconName, text, onClick, isActive }: Props) {
  return (
    <div className="flex items-center py-16 px-24" onClick={onClick}>
      <Icon name={iconName} className={classnames('mr-8 group-hover:text-blue-600', {
        'text-blue-600': isActive,
      })} />
      <span
        className={classnames(
          'text-body2-no-color-weight group-hover:text-blue-600 group-hover:font-medium', {
            'text-blue-600': isActive,
            'font-medium': isActive,
            'text-gray-900': !isActive,
            'font-normal': !isActive,
          })}
      >
        {text}
      </span>
    </div>
  );
}
