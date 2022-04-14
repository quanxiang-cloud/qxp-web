import React, { useRef } from 'react';
import { observer } from 'mobx-react';

import Modal from '@c/modal';

import BasicInfoForm from './basic-info-form';
import store from './store';

function EditRoleModal(): JSX.Element {
  const formRef = useRef<any>();

  const handleSubmit = (): void => {
    formRef.current?.handleSubmit((roleDetails: RoleCreate) => {
      if (store.modalType === 'add') {
        store.addRole(roleDetails);
        return;
      }

      if (store.modalType === 'copy') {
        store.curRole && store.copyRole({ id: store.curRole?.id, ...roleDetails });
        return;
      }

      store.curRole && store.updateRole({ id: store.curRole.id, ...roleDetails });
    })();
  };

  return (
    <Modal
      className="static-modal"
      title={store.modalType === 'edit' ? '修改信息' : '添加角色'}
      onClose={() => store.setModalType('')}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: () => store.setModalType(''),
        },
        {
          text: '保存',
          key: 'confirm',
          iconName: 'check',
          loading: store.editLoading,
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <BasicInfoForm
        type={store.modalType}
        className="p-20"
        ref={formRef}
        defaultValue={store.modalType === 'add' ? {} : store.curRole} />
    </Modal>
  );
}

export default observer(EditRoleModal);
