import React, { useState } from 'react';

import ViewLayoutItem, { ViewLayoutItemProps, SelectLayoutType } from './view-layout-item';
import { LayoutType } from '../../../app-details/view-orchestration/types.d';

type Props = {
  className?: string;
  onChange?: (layoutType: SelectLayoutType) => void;
}

const APP_LAYOUT_CONFIG: ViewLayoutItemProps[] = [
  {
    type: LayoutType.HeaderContent,
    title: '顶部',
  },
  {
    type: LayoutType.LeftSidebarContent,
    title: '左侧',
  },
  {
    type: LayoutType.RightSidebarContent,
    title: '右侧',
  },
];

function AppLayoutSelector({ className, onChange }: Props): JSX.Element {
  const [currentLayoutType, setCurrentLayoutType] = useState<SelectLayoutType>(LayoutType.HeaderContent);

  return (
    <div className={className}>
      <div className='w-full py-20 flex justify-between gap-20'>
        {
          APP_LAYOUT_CONFIG.map((viewLayoutItem) => (
            <ViewLayoutItem
              key={viewLayoutItem.type}
              currentLayoutType={currentLayoutType}
              layout={viewLayoutItem}
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
