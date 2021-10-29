import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

type Props = {
  fullScreen: boolean;
  title: string;
  list: FormInfoCardDataProp[];
}

type InfoCardProps = {
  list: FormInfoCardDataProp[],
  className: string
}

const FULL_COMP = ['AssociatedRecords', 'SubTable'];

export function InfoCard({ list, className }: InfoCardProps): JSX.Element {
  return (
    <div className={cs('grid gap-x-16 grid-flow-row-dense p-16 pr-0', className)}>
      {list.map(({ label, value, key, fieldSchema }) => (
        <div
          key={key}
          className={cs(
            'flex text-12 p-8 items-center ',
            { 'col-span-2': FULL_COMP.includes(fieldSchema['x-component'] as string) },
          )}
        >
          <div className='text-gray-600'>{label}：</div>
          <div className='text-gray-900'>{value}</div>
        </div>),
      )}
    </div>
  );
}

function GroupCard({ title, list, fullScreen }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const infoHeigh = 36;
  const groupCol = fullScreen ? 4 : 2;
  const groupLine = Math.ceil((list?.length || 0) / groupCol);
  const groupHeigh = (infoHeigh * groupLine);
  return (
    <div
      style={{
        '--group-box-height': (groupHeigh + 68) + 'px',
      } as React.CSSProperties}
      className={cs('border rounded-8 mt-16 overflow-hidden',
        isOpen ? 'form-group-box-open' : 'form-group-box-close',
      )}
    >
      <div className="form-group-title flex justify-between items-center py-8 px-16">
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

      <InfoCard list={list} className ={fullScreen ? 'grid-cols-4' : 'grid-cols-2'}/>
    </div>
  );
}

export default GroupCard;
