import React from 'react';

interface Props {
  onClick?: () => void;
}

function InitApiFail({ onClick }: Props): JSX.Element {
  return (
    <div className='bg-white w-full h-full relative'>
      <div className='absolute top-1/2 left-1/2'>
        API加载失败，请
        <span className='text-blue-600 cursor-pointer' onClick={onClick}>重试</span>
      </div>
    </div>
  );
}

export default InitApiFail;
