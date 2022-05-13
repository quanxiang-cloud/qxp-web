import React from 'react';
import cs from 'classnames';

import SelectCard from '@c/select-card';

import { LayoutType } from '../../../app-details/view-orchestration/types.d';

export type SelectLayoutType = LayoutType;

export type ViewLayoutItemProps = {
  type: LayoutType,
  title: string,
}

type Props = {
    currentLayoutType: SelectLayoutType,
    layout: ViewLayoutItemProps,
    onClick?: (type: SelectLayoutType) => void,
}

export default function ViewLayoutItem({ currentLayoutType, layout, onClick }: Props): JSX.Element {
  const isSelected = currentLayoutType === layout.type;

  function viewLayoutItemImgRender(): React.ReactNode {
    const { type } = layout;
    return (
      <div className={cs('w-full flex flex-1 rounded-t-4 overflow-hidden', {
        'flex-col': type === LayoutType.HeaderContent,
        'flex-row-reverse': type === LayoutType.RightSidebarContent,
      })}>
        <div className='flex-1 bg-blue-300'></div>
        <div className='flex-3 bg-blue-200'></div>
      </div>
    );
  }

  return (
    <SelectCard
      className={cs('flex-1 relative w-172 h-130 px-8 pt-8 flex flex-col justify-between items-center gap-4 cursor-pointer duration-300 border-blue-200 box-border border-1 rounded-8 overflow-hidden hover:shadow-more-action', {
        'border-blue-600': isSelected,
      })}
      onClick={() => onClick?.(layout.type)}
      isSelected={isSelected}
    >
      {viewLayoutItemImgRender()}
      <span className='text-12'>{layout.title}</span>
    </SelectCard>
  );
}
