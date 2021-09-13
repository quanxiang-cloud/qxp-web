import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

interface Props {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

function ParamSection({
  title,
  children,
  className,
}: Props) {
  const [expand, setExpand] = useState(true);

  return (
    <div className={cs('params-sec mt-24', className)}>
      <div className='sec-title h-32 w-full bg-gray-100 flex items-center mb-8'>
        <div
          className='flex w-full h-20 cursor-pointer'
          style={{ lineHeight: '20px' }}
          onClick={()=> setExpand(!expand)}
        >
          <span className='border-l-4 border-indigo-500 flex-1 pl-10'>
            {title}
          </span>
          <Icon
            className='justify-center items-center w-20 h-20 hover:bg-gray-200 self-center mr-10'
            name={expand ? 'expand_more' : 'expand_less'}
            size={20}
            clickable
          />
        </div>
      </div>
      <div className={cs('sec-body bg-white', { 'hide-body': !expand })}>
        {children}
      </div>
    </div>
  );
}

export default ParamSection;
