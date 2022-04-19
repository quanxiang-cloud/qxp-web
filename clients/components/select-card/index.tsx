import React from 'react';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';

import './index.scss';

export interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isSelected?: boolean;
}

export default function SelectCard({ className, isSelected, children, ...restProps }: Props): JSX.Element {
  return (
    <div
      {...restProps}
      className={cs('relative', className)}
    >
      {
        isSelected && (
          <div className='card-selected text-white w-0 h-0 absolute top-0 right-0'>
            <Icon className='absolute -top-14 -left-2' name='done' size={16} />
          </div>)
      }
      { children }
    </div>
  );
}
