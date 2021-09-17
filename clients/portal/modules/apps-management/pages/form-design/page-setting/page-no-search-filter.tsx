import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Button from '@c/button';

import store from '../store';

function PageNoSearchFilter(): JSX.Element | null {
  if (store.filters.length) {
    return null;
  }

  return (
    <div className='flex justify-between rounded-12 bg-white items-center px-20 py-10 mb-10'>
      <div className='text-caption-no-color text-gray-400 flex-1 flex items-center'>
        <Icon name="message-details-empty" size={60}/>
        <p className="text-caption">
            尚未配置筛选条件。点击&nbsp;
          <span onClick={() => store.filterModalVisible = true} className="text-btn">配置筛选条件</span>
            ，便于数据查询筛选。
        </p>
      </div>
      <div>
        <Button className='mr-16' modifier='primary'>查询</Button>
        <Button >重置</Button>
      </div>
    </div>
  );
}

export default observer(PageNoSearchFilter);
