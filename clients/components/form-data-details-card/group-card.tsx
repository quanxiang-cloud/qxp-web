import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

type Props = {
  fullScreen: boolean;
  title: string;
  list: FormInfoCardDataProp[];
}

const FULL_COMP = ['AssociatedRecords', 'SubTable'];

export function InfoCard({ list }: {list: FormInfoCardDataProp}): JSX.Element {
  const { label, value, key, fieldSchema } = list;
  return (
    <div
      key={key}
      className={cs(
        'flex text-12 p-8 items-center ',
        {
          'col-span-full': FULL_COMP.includes(fieldSchema['x-component'] as string),
        },
      )}
    >
      <div className='text-gray-600'>{label}：</div>
      <div className='text-gray-900 flex-1 card-value'>{value}</div>
    </div>
  );
}

function GroupCard({ title, list, fullScreen }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='border rounded-8 mt-16 overflow-hidden duration-300 col-span-full'>
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
      { isOpen && (
        <div
          className={cs('grid gap-x-16 grid-flow-row-dense p-16 pr-0',
            fullScreen ? 'grid-cols-4' : 'grid-cols-2',
          )}
        >
          {list.map((group) =>
            <InfoCard key={group.key} list={group as FormInfoCardDataProp}/>,
          )}
        </div>
      )}
    </div>
  );
}

export default GroupCard;
