import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from '@c/button';
import TextHeader from '@c/text-header';

import RightItem from './right-item';

type Props = {
  pageSettingStore: any;
}

function ForEmployee({ pageSettingStore }: Props) {
  console.log('appSettingStore: ', pageSettingStore);

  const handleClick = (key: string, right: any) => {
    switch (key) {
    case 'del':
      pageSettingStore.deleteRight(right.id);
      break;
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <TextHeader
        title="对员工发布"
        desc='将员工加入权限组，授权他们查看或管理数据。'
        action="🔨 如何维护权限组"
        className="my-app-header header-background-image"
      />
      <div className='m-20'><Button modifier='primary' iconName='add'>新建权限组</Button></div>
      <div className='px-20 overflow-auto'>
        {pageSettingStore.rightList.map((right: any) => (
          <RightItem key={right.id} right={right} actions={handleClick} />
        ))}
      </div>
    </div>
  );
}

export default inject('pageSettingStore')(observer(ForEmployee));
