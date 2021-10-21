import React, { useState, useRef } from 'react';
import Modal from '@c/modal';

import BasicInfoForm from './basic-info-form';

import store from './store';
import toast from '@lib/toast';

type Props = {
  type: string;
  onCancel: () => void;
}

function EditRightModal({ type, onCancel }: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();

  const handleSubmit = (): void => {
    formRef.current?.handleSubmit((rights: RightsCreate) => {
      setLoading(true);
      if (type === 'add') {
        store.addRightsGroup(rights).then(() => {
          setLoading(false);
          onCancel();
        }).catch((err) => {
          toast.error(err);
          setLoading(false);
        });
        return;
      }

      if (type === 'copy') {
        store.copyRightsGroup({ id: store.currentRights.id, ...rights }).then(() => {
          setLoading(false);
          onCancel();
        }).catch((err) => {
          toast.error(err);
          setLoading(false);
        });
        return;
      }

      store.updatePerGroup({ id: store.currentRights.id, ...rights }).then(()=>{
        setLoading(false);
        onCancel();
      }).catch((err) => {
        toast.error(err);
        setLoading(false);
      });
    })();
  };

  return (
    <Modal
      className="static-modal"
      title={type === 'edit' ? '修改信息' : '添加角色'}
      onClose={onCancel}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
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
        type={type}
        className="p-20"
        ref={formRef}
        defaultValue={type === 'add' ? {} : store.currentRights}/>
    </Modal>
  );
}

export default EditRightModal;
