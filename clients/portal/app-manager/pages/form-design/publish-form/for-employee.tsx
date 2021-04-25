import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import TextHeader from '@c/text-header';
import PageLoading from '@appC/page-loading';

import CreateRightModal from './create-right-modal';
import RightsItem from './rights-item';
import store from '../store';

function ForEmployee() {
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    store.fetchRights();
  }, []);

  const handleClick = (key: string, rights: Rights) => {
    switch (key) {
    case 'del':
      store.deleteRight(rights.id);
      break;
    }
  };

  const rightsRender = () => {
    if (store.rightsLoading) {
      return <PageLoading />;
    }

    if (store.rightsList.length) {
      return (
        <div className='px-20 overflow-auto'>
          {store.rightsList.map((rights: Rights) => (
            <RightsItem key={rights.id} rights={rights} actions={handleClick} />
          ))}
        </div>
      );
    }
    return (
      <div className='app-no-data mt-58'>
        <img src='/dist/images/new_tips.svg' />
        <span>暂无权限组</span>
      </div>
    );
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
      {rightsRender()}
      {modalType === 'creatRight' && (
        <CreateRightModal onCancel={() => setModalType('')} />
      )}
    </div>
  );
}

export default observer(ForEmployee);
