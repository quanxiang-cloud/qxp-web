import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import Button from '@c/button';
import Icon from '@c/icon';

function UnusualTaskDetail(): JSX.Element {
  const history = useHistory();

  function goBack(): void {
    history.goBack();
  }
  return (
    <div
      className="py-20 px-58 flex justify-center items-start flex-grow overflow-hidden
      flex-col flex-1"
      style={{
        height: 'calc(100vh - 62px)',
      }}
    >
      <div className='flex items-center'>
        <Icon name='reply' size={20} onClick={goBack}/>
        <NavLink to='/system'>系统管理</NavLink>
        <span className="mx-8">/</span>
        <NavLink to='/system/unusual'>异常任务</NavLink>
        <span className="mx-8">/</span>
        <span className='text-black-50 '>异常任务详情</span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{ height: 'calc(100% - 24px)' }}
      >
        <div className="relative w-full mt-16 rounded-12 bg-white h-full">
          <div className="p-20 flex items-center justify-between">
            <div className="flex">
              <Button className="mr-8">退回某步</Button>
              <Button className="mr-8">打回重填</Button>
              <Button className="mr-8">指定处理人</Button>
              <Button>作废流程</Button>
            </div>
            <div className="p-10 flex">
              <span>查看流程图</span>
              <Icon name='reply' size={20} onClick={goBack}/>
            </div>
          </div>
          <div className="h-1 border-b-2 border-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export default UnusualTaskDetail;
