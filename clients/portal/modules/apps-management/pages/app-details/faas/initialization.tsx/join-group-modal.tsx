import React from 'react';

import Modal from '@c/modal';

import store from './store';

function AddToGroupModal(): JSX.Element {
  return (
    <Modal
      title="加入协作"
      onClose={() => store.setModalType('')}
      footerBtns={[
        {
          text: '否，暂不加入',
          key: 'cancel',
          onClick: () => store.setModalType(''),
        },
        {
          text: '是，确定加入',
          key: 'confirm',
          modifier: 'primary',
          onClick: () => store.addUserToGroup(),
        },
      ]}
    >
      <div className='m-20'>
        是否加入该faas空间进行协作?
      </div>
    </Modal>
  );
}

export default AddToGroupModal;
