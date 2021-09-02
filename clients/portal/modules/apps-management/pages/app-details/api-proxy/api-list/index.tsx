import React from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';

import SideNav from '../side-nav';
import ApiList from './list';
import GroupSetting from './group-setting';
import ApiKeys from './api-keys';
import store from '../stores';

interface Props {
  className?: string;
}

function ListPage(props: Props) {
  const { activeGroup } = store;

  const renderContent = ()=> {
    if (!activeGroup) {
      return (
        <p className='text-gray-500 ml-20 mt-20'>
          No api data
        </p>
      );
    }

    return (
      <>
        <div className='py-10 px-10 flex items-center bg-gray-100 h-52 border-b-1'>
          <span className='text-gray-900 font-medium'>{activeGroup?.name}</span>
        </div>
        <Tab
          items={[
            {
              id: 'api-list',
              name: 'API 列表',
              content: <ApiList/>,
            },
            {
              id: 'group-setting',
              name: '分组配置',
              content: <GroupSetting/>,
            },
            {
              id: 'api-keys',
              name: 'API 密钥',
              content: <ApiKeys />,
            },
          ]}
        />
      </>
    );
  };

  return (
    <div className='flex flex-grow'>
      <SideNav />
      <div className='w-full h-full overflow-auto'>
        {renderContent()}
      </div>
    </div>
  );
}

export default observer(ListPage);
