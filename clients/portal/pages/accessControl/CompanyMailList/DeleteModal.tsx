import React from 'react';
import { Modal } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';

interface DeleteModalProps {
  visible: boolean;
  closeModal(): void;
  okModal(): void;
}

export const DeleteModal = ({ visible, closeModal, okModal }: DeleteModalProps) => {
  return (
    <Modal
      title="删除"
      visible={visible}
      onOk={closeModal}
      onCancel={okModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 px-dot-4"
                src="./dist/images/icon_error.svg"
                alt="icon_error"
              />
            }
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 px-dot-4"
                src="./dist/images/icon_true.svg"
                alt="icon_true"
              />
            }
            onClick={okModal}
          >
            确定删除
          </Button>
        </div>
      }
    >
      <div className="text-dot-7">
        确定要删除
        <span className="mx-1 text-dot-8 font-semibold">IT 运维部</span>
        吗？
      </div>
    </Modal>
  );
};
