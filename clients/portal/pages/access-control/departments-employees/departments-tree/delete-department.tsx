import React from 'react';
import { Modal, Message } from '@QCFE/lego-ui';

import Button from '@c/button';
import { NodeRenderProps } from '@c/headless-tree/types';

import { deleteDEP } from '../api';

interface Props extends NodeRenderProps<Department> {
  closeModal(): void;
}

export default function DeleteModal({ node, store, closeModal }: Props) {
  function handleOk() {
    deleteDEP(node.id).then(({ code, msg }) => {
      if (!code) {
        Message.success({ content: '删除成功' });
        store.deleteNode(node);
        closeModal();
        return;
      }

      Message.error(msg || '');
    });
  }

  return (
    <Modal
      visible
      appendToBody
      title="删除"
      className="static-modal"
      onCancel={closeModal}
      footer={
        (<div className="flex items-center">
          <Button
            iconName="close"
            className="mr-20"
            onClick={closeModal}
          >
            取消
          </Button>
          <Button
            modifier="primary"
            iconName="check"
            onClick={handleOk}
          >
            确定删除
          </Button>
        </div>)
      }
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
