import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TextHeader from '@c/text-header';
import Button from '@c/button';

import CreateRightModal from './create-right-modal';
import RightsGroups from './rights-groups';
import store from './store';

function UsersAndPermissions() {
  const [modalType, setModalType] = useState('');
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.appID = appID;
    store.fetchRights();
  }, [appID]);

  return (
    <>
      <TextHeader
        title='用户及权限'
        desc='设置应用内页面的字段权限、数据权限、以及操作权限'
        className="app-list-header header-background-image"
        itemClassName='items-center'
      />
      <Button
        onClick={() => setModalType('creatRight')}
        modifier='primary'
        iconName='add'
        className='mx-20 my-24'
      >
        新建权限组
      </Button>
      <RightsGroups />
      {modalType === 'creatRight' && (
        <CreateRightModal onCancel={() => setModalType('')} />
      )}
    </>
  );
}

export default UsersAndPermissions;
