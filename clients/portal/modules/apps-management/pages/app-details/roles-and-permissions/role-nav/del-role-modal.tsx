import React from 'react';
import Modal from '@c/modal';

import store from './store';
import { observer } from 'mobx-react';

function DelRoleModal(): JSX.Element {
  function handleDleteSubmit(): void {
    store.curRole && store.deleteRole(store.curRole.id);
  }

  return (
    <Modal
      className="static-modal"
      title='提示'
      onClose={() => store.setModalType('')}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: () => store.setModalType(''),
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleDleteSubmit,
        },
      ]}
    >
      <div className='px-20 py-32'>
        删除该角色后，在平台内无法恢复角色
        <span className='text-16 text-gray-900 mx-6'>{store.curRole?.name || ''}</span>
          数据，确定删除该角色吗？
      </div>
    </Modal>
  );
}

export default observer(DelRoleModal);
