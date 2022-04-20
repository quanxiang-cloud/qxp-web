import React, { useState } from 'react';
import cs from 'classnames';

import AppLayoutItem, { LayoutItemProps, SelectLayoutType } from './app-layout-item';
import { LayoutType } from './app-layout-item';

type Props = {
  title: string;
  includeFree?: boolean;
  className?: string;
  onChange?: (layoutType: SelectLayoutType) => void;
}

const APP_LAYOUT_CONFIG: LayoutItemProps[] = [
  {
    img: 'top-nav.png',
    type: LayoutType.HeaderContent,
    title: '顶部导航',
    description: '不使用任何形式的导航，从空白开始创建应用',
  },
  {
    img: 'left-nav.png',
    type: LayoutType.LeftSidebarContent,
    title: '左侧导航',
    description: '不使用任何形式的导航，从空白开始创建应用',
  },
];

function AppLayoutSelector({ title, includeFree = true, className, onChange }: Props): JSX.Element {
  const [currentLayoutType, setCurrentLayoutType] = useState<SelectLayoutType>('free');

  const layoutConfig = includeFree ? ([{
    img: 'no-nav.png',
    type: 'free',
    title: '无导航',
    description: '不使用任何形式的导航，从空白开始创建应用',
  }] as LayoutItemProps[]).concat(APP_LAYOUT_CONFIG) : APP_LAYOUT_CONFIG;

  return (
    <div className={cs('-mt-24 px-20', className)}>
      <span>{title}</span>
      <div className='w-full py-20 flex justify-between gap-20'>
        {
          layoutConfig.map((layoutItem) => ( // todo this common card select component
            <AppLayoutItem
              key={layoutItem.type}
              currentLayoutType={currentLayoutType}
              layout={layoutItem}
              onClick={(type) => {
                setCurrentLayoutType(type);
                onChange?.(type);
              }}
            />
          ))
        }
      </div>
    </div>
  );
}

export default AppLayoutSelector;
