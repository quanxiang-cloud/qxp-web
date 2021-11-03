import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import AddOptionSetItem from './option-set-popconfirm/add-item';
import EditOptionSetItem from './option-set-popconfirm/edit-item';
import DeleteOptionSetItem from './option-set-popconfirm/delete-item';

import store from './store';

interface Props {
  className?: string;
}

function ListContent({ className }: Props): JSX.Element {
  return (
    <div className='flex h-full overflow-auto mx-16 rounded-t-8 text-blueGray-400'>
      <div
        className={
          cs('flex flex-col w-2/3 rounded-t-8 border-t-1 border-l-1 border-r-1 border-solid',
            className,
          )
        }>
        <div className='flex items-center h-39 rounded-t-8 bg-gray-100'>
          <span className='py-8 pl-16 items-center'>
            可选项
          </span>
        </div>
        <AddOptionSetItem type='list' />
        {
          store.list.map(({ label }: OptionSetListItem, idx: number) => {
            return (
              <div
                className='flex items-center px-16 hover:bg-blue-100 cursor-pointer action-shows'
                key={idx}
              >
                <span
                  title={label}
                  className='items-center w-5/6 py-8 text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap flex-1'>
                  {label}
                </span>
                <span className='action-show'>
                  <EditOptionSetItem type='list' label={label} idx={idx} />
                  <DeleteOptionSetItem type='list' idx={idx} />
                </span>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default observer(ListContent);
