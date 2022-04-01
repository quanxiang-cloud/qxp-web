import React, { useState } from 'react';
import cs from 'classnames';

import LayoutView, { SelectLayoutType } from './layout-view';
import { LayoutType } from '../../../app-details/view-orchestration/types.d';

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

  return (
    <div className={cs('-mt-24 px-20', className)}>
      <span>{title}</span>
      <div className='w-full py-20 flex justify-between gap-20'>
        {
          (includeFree ? LAYOUT_TYPES : NO_FREE_LAYOUT_TYPES).map((layoutType) => (
            <LayoutView
              key={layoutType}
              currentLayoutType={currentLayoutType}
              layoutType={layoutType}
              onClick={() => {
                setCurrentLayoutType(layoutType);
                onSelect?.(layoutType);
              }}
            />
          ))
        }
      </div>
    </div>
  );
}

export default AppLayoutSelector;
