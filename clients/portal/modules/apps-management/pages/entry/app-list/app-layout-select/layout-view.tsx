import React from 'react';
import cs from 'classnames';

import { LayoutType } from '../../../app-details/view-orchestration/types.d';

export type SelectLayoutType = LayoutType | 'free';

type Props = {
    currentLayoutType: SelectLayoutType,
    layoutType: SelectLayoutType,
    onClick?: () => void,
}

export default function LayoutView({ currentLayoutType, layoutType, onClick }: Props): JSX.Element {
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
    <div
      className={cs('flex-1 h-92 flex justify-center gap-4 cursor-pointer duration-300', {
        'flex-col': layoutType === LayoutType.HeaderContent,
        'flex-row-reverse': layoutType === LayoutType.RightSidebarContent,
        'border-1 border-blue-200 items-center': !layoutType || layoutType === 'free',
        'border-blue-400': currentLayoutType === 'free',
      })}
      onClick={onClick}
    >
      {layoutBoxContentRender(currentLayoutType, layoutType)}
    </div>
  );
}
