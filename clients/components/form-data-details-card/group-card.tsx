import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

type Props = {
  fullScreen: boolean;
  title: string;
  list: FormInfoCardDataProp[];
}

type InfoCardProps = {
  list: FormInfoCardDataProp[],
  className: string;
  fullScreen?: boolean;
}

const GROUP_TITLE_HEIGHT = 36;
const FULL_COMP = ['AssociatedRecords', 'SubTable'];

export function InfoCard({ list, className, fullScreen }: InfoCardProps): JSX.Element {
  return (
    <div className={cs('grid gap-x-16 grid-flow-row-dense p-16 pr-0', className)}>
      {list.map(({ label, value, key, fieldSchema }) => (
        <div
          key={key}
          className={cs(
            'flex text-12 p-8 items-center ',
            {
              'col-span-2': !fullScreen && FULL_COMP.includes(fieldSchema['x-component'] as string),
              'col-span-4': fullScreen && FULL_COMP.includes(fieldSchema['x-component'] as string),
            },
          )}
        >
          <div className='text-gray-600'>{label}：</div>
          <div className='text-gray-900 flex-1 card-value'>{value}</div>
        </div>),
      )}
    </div>
  );
}

function GroupCard({ title, list, fullScreen }: Props): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState(0);

  useEffect(()=> {
    setHeight(cardRef.current?.offsetHeight || 0);
  }, [fullScreen, list]);
  return (
    <div
      style={{
        height: isOpen ? height + GROUP_TITLE_HEIGHT : GROUP_TITLE_HEIGHT,
      } as React.CSSProperties}
      className='border rounded-8 mt-16 overflow-hidden transition-all duration-300'
    >
      <div className="form-group-title flex justify-between items-center py-8 px-16 bg-gray-50">
        <div className='flex items-center'>
          <hr className='title-line h-20 w-4'/>
          <div className='font-semibold text-12 text-gray-600 ml-4 inline-block'>{title}</div>
        </div>
        <Icon
          size={20}
          className='text-icon-btn'
          onClick={() => setIsOpen(!isOpen)}
          name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
        />
      </div>

      <div ref={cardRef}>
        <InfoCard list={list} className ={fullScreen ? 'grid-cols-4' : 'grid-cols-2'}/>
      </div>
    </div>
  );
}

export default GroupCard;
