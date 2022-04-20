import React from 'react';
import cs from 'classnames';

import SelectCard from '@c/select-card';

// import { LayoutType } from '../../../app-details/view-orchestration/types.d';

export type SelectLayoutType = LayoutType | 'free';

export type LayoutItemProps = {
  img: string,
  type: LayoutType | 'free',
  title: string,
  description: string,
}

type Props = {
    currentLayoutType: SelectLayoutType,
    layout: LayoutItemProps,
    onClick?: (type: SelectLayoutType) => void,
}

export enum LayoutType {
  HeaderContent = 'header-content',
  LeftSidebarContent = 'left-sidebar-content',
}
export default function LayoutView({ currentLayoutType, layout, onClick }: Props): JSX.Element {
  const isSelected = currentLayoutType === layout.type;
  return (
    <SelectCard
      className={cs('flex-1 relative h-200 w-180 flex flex-col justify-between gap-4 cursor-pointer duration-300 border-blue-200 box-border border-1 rounded-8 overflow-hidden hover:shadow-more-action', {
        'border-blue-600': isSelected,
      })}
      onClick={() => onClick?.(layout.type)}
      isSelected={isSelected}
    >
      <img className='w-full' src={`/dist/images/${layout.img}`} alt="no-nav-layout" />
      <div className='flex flex-col px-7 flex-1 justify-evenly'>
        <span className='font-semibold'>{layout.title}</span>
        <span className='text-gray-500 text-12'>{layout.description}</span>
      </div>
    </SelectCard>
  );
}
