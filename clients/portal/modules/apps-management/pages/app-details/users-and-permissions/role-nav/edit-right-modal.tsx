import React, { useState, useRef } from 'react';
import Modal from '@c/modal';

import BasicInfoForm from './basic-info-form';

import store from './store';
import toast from '@lib/toast';
import { observer } from 'mobx-react';

function EditRightModal(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();

  const handleSubmit = (): void => {
    formRef.current?.handleSubmit((roleDetails: RoleCreate) => {
      setLoading(true);
      if (store.modalType === 'add') {
        store.addRole(roleDetails).then(() => {
          setLoading(false);
          store.setModalType('');
        }).catch((err) => {
          toast.error(err);
          setLoading(false);
        });
        return;
      }

      if (store.modalType === 'copy') {
        store.copyRole({ id: store.curRole.id, ...roleDetails }).then(() => {
          setLoading(false);
          store.setModalType('');
        }).catch((err) => {
          toast.error(err);
          setLoading(false);
        });
        return;
      }

      store.updateRole({ id: store.curRole.id, ...roleDetails }).then(() => {
        setLoading(false);
        store.setModalType('');
      }).catch((err) => {
        toast.error(err);
        setLoading(false);
      });
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
          loading: loading,
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

export default observer(EditRightModal);
