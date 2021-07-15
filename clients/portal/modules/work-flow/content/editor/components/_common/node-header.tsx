import React, { KeyboardEvent, MouseEvent } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import { updateNodeDataByKey } from '@flowEditor/store';

interface Props {
  title: string;
  id: string;
  className: string;
  titleClassName: string;
  iconName: string;
  iconClassName?: string;
  readonly?: boolean;
}

export default function NodeHeader({
  id, title, className, iconClassName, titleClassName, iconName, readonly,
}: Props): JSX.Element {
  function onMouseDown(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onMouseUp(e: MouseEvent): void {
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
      {!readonly && (
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
      )}
      {readonly && title}
    </header>
  );
}
