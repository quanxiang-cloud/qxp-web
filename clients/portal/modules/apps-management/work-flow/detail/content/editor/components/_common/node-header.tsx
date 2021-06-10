import React, { KeyboardEvent, MouseEvent } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import { updateNodeDataByKey } from '@flow/detail/content/editor/store';

interface Props {
  title: string;
  id: string;
  className: string;
  titleClassName: string;
  iconName: string;
  iconClassName?: string;
}

export default function NodeHeader({
  id, title, className, iconClassName, titleClassName, iconName,
}: Props) {
  function onMouseDown(e: MouseEvent) {
    e.stopPropagation();
  }

  function onMouseUp(e: MouseEvent) {
    e.stopPropagation();
  }

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
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onChange={(e) => updateNodeDataByKey(id, 'name', () => e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className={cs(
          'text-caption-no-color-weight font-medium',
          'outline-none work-flow-node-header-input',
          titleClassName,
        )}
        defaultValue={title}
      />
    </header>
  );
}
