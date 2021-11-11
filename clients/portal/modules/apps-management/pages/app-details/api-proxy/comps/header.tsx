import React from 'react';
import { observer } from 'mobx-react';

interface Props {
  className?: string;
  name?: string;
}

function Header({ name }: Props) {
  return (
    <div className='flex justify-between items-center py-10 opacity-95 bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12'>
      <span className='text-gray-900 font-medium'>{name || ''}</span>
    </div>
  );
}

export default observer(Header);
