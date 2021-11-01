import React from 'react';
import { observer } from 'mobx-react';

interface Props {
  className?: string;
  name?: string;
}

function Header({ name }: Props) {
  return (
    <div className='py-10 px-10 flex items-center bg-white h-52 border-b-1'>
      <span className='text-gray-900 font-medium'>{name || ''}</span>
    </div>
  );
}

export default observer(Header);
