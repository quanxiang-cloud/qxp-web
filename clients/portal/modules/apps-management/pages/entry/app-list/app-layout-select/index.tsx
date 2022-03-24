import React, { useState } from 'react';
import cs from 'classnames';

import { LayoutType } from '../../../app-details/view-orchestration/types.d';

export type SelectLayoutType = LayoutType | 'free';

type Props = {
  title: string;
  includeFree?: boolean;
  className?: string;
  onSelect?: (layoutType: SelectLayoutType) => void;
}

const LAYOUT_TYPES: Array<SelectLayoutType> = [...Object.values(LayoutType), 'free'];
const NO_FREE_LAYOUT_TYPES: Array<LayoutType> = [...Object.values(LayoutType)];

function AppLayoutSelector({ title, includeFree = true, className, onSelect }: Props): JSX.Element {
  const [currentLayoutType, setCurrentLayoutType] = useState<SelectLayoutType>('free');

  function layoutBoxContentRender(
    currentLayoutType: SelectLayoutType,
    layoutType: SelectLayoutType,
  ): React.ReactNode {
    if (!layoutType || layoutType === 'free') {
      return (
        <span className={cs({ 'text-gray-300': !(currentLayoutType === 'free') })}>
          无预设布局
        </span>
      );
    }

    return (
      <>
        <div className={cs('flex-1 duration-300',
          currentLayoutType === layoutType ? 'bg-blue-300' : 'bg-gray-200')} />
        <div className={cs('flex-5 duration-300',
          currentLayoutType === layoutType ? 'bg-gray-300' : 'bg-gray-200')} />
      </>
    );
  }

  return (
    <div className={cs('-mt-24 px-20', className)}>
      <span>{title}</span>
      <div className='w-full py-20 flex justify-between gap-20'>
        {
          (includeFree ? LAYOUT_TYPES : NO_FREE_LAYOUT_TYPES).map((layoutType) => (
            <div
              key={layoutType}
              className={cs('flex-1 h-92 flex justify-center gap-4 cursor-pointer duration-300', {
                'flex-col': layoutType === LayoutType.HeaderContent,
                'flex-row-reverse': layoutType === LayoutType.RightSidebarContent,
                'border-1 border-blue-200 items-center': !layoutType || layoutType === 'free',
                'border-blue-400': currentLayoutType === 'free',
              })}
              onClick={() => {
                setCurrentLayoutType(layoutType);
                onSelect?.(layoutType);
              }}
            >
              {layoutBoxContentRender(currentLayoutType, layoutType)}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default AppLayoutSelector;
