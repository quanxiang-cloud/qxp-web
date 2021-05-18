import React from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';
import { NodeRenderProps } from '@c/headless-tree/types';

import { deleteDEP } from '../api';

interface Props extends NodeRenderProps<Department> {
  closeModal(): void;
}

export default function DeleteModal({ node, store, closeModal }: Props) {
  function handleOk() {
    deleteDEP(node.id).then(() => {
      toast.success('删除成功');
      store.deleteNode(node);
      closeModal();
    }).catch((error) => {
      toast.error(error || '');
    });
  }

  return (
    <Modal
      title="删除"
      className="static-modal"
      onClose={closeModal}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: '确定删除',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleOk,
        },
      ]}
    >
      <div className="text-14">
        确定要删除
        <span className="mx-4 font-semibold text-gray-900 text-h5">
          {node && node.data.departmentName}
        </span>
        吗？
      </div>
    </Modal>
  );
}
