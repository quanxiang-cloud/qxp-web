import React from 'react';

function Placeholder(): JSX.Element {
  return (
    <div className='w-full h-32'>
      <div className='ant-input h-full flex justify-between py-2 items-center'>
        <div className='flex-1'>
          <span className='text-gray-300'>请选择</span>
        </div>
        <span className='cursor-pointer text-blue-500'>
          选择关联数据
        </span>
      </div>
    </div>
  );
}

export default Placeholder;
