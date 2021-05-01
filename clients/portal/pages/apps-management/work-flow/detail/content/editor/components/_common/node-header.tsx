import React, { KeyboardEvent } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import { updateNodeData } from '../../store';

interface Props {
  title: string;
  type: string;
  className: string;
  titleClassName: string;
  iconName: string;
  iconClassName?: string;
}

export default function NodeHeader({
  type, title, className, iconClassName, titleClassName, iconName,
}: Props) {
  return (
    <header
      className={cs(
        'flex items-center py-4 px-12 rounded-tl-8 rounded-tr-8',
        'rounded-br-2 rounded-bl-8',
        className,
      )}
    >
      <Icon name={iconName} className={cs('mr-4', iconClassName)} />
      <input
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => updateNodeData(type, 'name', () => e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className={cs(
          'text-caption-no-color-weight font-medium',
          'outline-none work-flow-node-header-input',
          titleClassName
        )}
        defaultValue={title}
      />
    </header>
  );
}
