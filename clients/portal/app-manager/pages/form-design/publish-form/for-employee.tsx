import React, { useState } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import TextHeader from '@c/text-header';

import CreateRightModal from './create-right-modal';
import RightItem from './right-item';
import store from '../store';

function ForEmployee() {
  const [modalType, setModalType] = useState('');

  const handleClick = (key: string, right: any) => {
    switch (key) {
    case 'del':
      store.deleteRight(right.id);
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
      <div className='m-20'>
        <Button
          onClick={() => setModalType('creatRight')}
          modifier='primary'
          iconName='add'
        >
          新建权限组
        </Button>
      </div>
      <div className='px-20 overflow-auto'>
        {store.rightList.map((right: any) => (
          <RightItem key={right.id} right={right} actions={handleClick} />
        ))}
      </div>
      {modalType === 'creatRight' && (
        <CreateRightModal onCancel={() => setModalType('')} />
      )}
    </div>
  );
}

export default observer(ForEmployee);
