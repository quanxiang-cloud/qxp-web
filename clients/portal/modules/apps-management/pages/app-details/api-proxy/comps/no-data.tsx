import React from 'react';

function NoData() {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div style={{ width: '120px', height: '120px', background: 'url("/dist/images/no-api-group.svg")' }} />
      <p>暂无分组</p>
    </div>
  );
}

export default NoData;
