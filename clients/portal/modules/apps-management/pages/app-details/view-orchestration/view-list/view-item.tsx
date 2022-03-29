import React from 'react';
import cs from 'classnames';

import ViewOption from './view-opiton';
import { View } from '../types.d';

import './index.scss';

type Props = {
  view: View;
  currentView: View;
  className?: string;
  onViewClick?: (view: View) => void;
  onOptionClick?: (key: string, view: View) => void;
}

function ViewItem({ view, onViewClick, onOptionClick, currentView }: Props): JSX.Element {
  const isActive = currentView.name === view.name;

  return (
    <li
      key={view.id}
      className={cs('menu-item-submenu-header', { 'bg-white': isActive })}
    >
      <div
        className={cs(
          'h-36 relative flex justify-between items-center px-12 ',
          ' select-none hover:bg-white text-black-50 cursor-pointer ',
          {
            'menu-item__active': isActive,
          })}
        onClick={() => onViewClick?.(view)}
      >
        <span className={cs('items-center flex', {
          'text-gray-900': isActive,
        })}>
          <span title={view.name} className='truncate view-item-title inline-block text-12'>{view.name}</span>
        </span>
        {
          isActive && (<ViewOption view={view} onViewOptionClick={onOptionClick} />)
        }
      </div>
    </li >
  );
}

export default ViewItem;
