import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Tooltip from '@c/tooltip';

interface Props {
  iconName: string;
  text: string;
  title: string;
  onClick: () => void;
  isActive: boolean;
}

export default function AsideMenuItem({ iconName, title, text, onClick, isActive }: Props) {
  return (
    <div className={cs('flex items-center py-16', {
      'bg-blue-100': isActive,
      'pl-24 pr-100': text,
      'px-24': !text,
    })} onClick={onClick}>
      {text ? (
        <Icon name={iconName} className={cs('mr-8 group-hover:text-blue-600', {
          'text-blue-600': isActive,
        })} />
      ) : (
        <Tooltip label={title} position="right" labelClassName="whitespace-nowrap">
          <Icon name={iconName} className={cs('mr-8 group-hover:text-blue-600', {
            'text-blue-600': isActive,
          })} />
        </Tooltip>
      )}
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
