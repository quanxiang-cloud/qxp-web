import React from 'react';
import cs from 'classnames';

import { Icon } from '@QCFE/lego-ui';

type Props<T> = {
  value: React.ReactNode;
  id?: T;
  className?: string;
  onDelete?: (id: T, e: React.MouseEvent) => void;
}

export default function Tag<T>({ value, id, className, onDelete }: Props<T>): JSX.Element {
  return (
    <span className={cs('tag inline-flex items-center', className)}>
      {value}
      {
        onDelete && (
          <span className="ml-4 flex items-center" onClick={(e): void => id && onDelete(id, e)}>
            <Icon
              changeable
              clickable
              name="close"
              size={12}
            />
          </span>

        )
      }
    </span>
  );
}
