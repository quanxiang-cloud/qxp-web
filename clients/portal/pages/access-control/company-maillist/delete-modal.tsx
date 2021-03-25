import React from 'react';
import { Modal } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';

interface DeleteModalProps {
  currDep: any;
  closeModal(): void;
  okModal(): void;
}

export const DeleteModal = ({ currDep, closeModal, okModal }: DeleteModalProps) => {
  return (
    <Modal
      visible
      title="删除"
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-2-dot-4 h-2-dot-4 px-8"
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
            className="bg-black-900"
            textClassName="text-white"
            icon={
              <img
                className="w-2-dot-4 h-2-dot-4 px-8"
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
      <div className="text-1-dot-4">
        确定要删除
        <span className="mx-2 text-1-dot-6
        font-semibold text-gray-900">{currDep && currDep.departmentName}</span>
        吗？
      </div>
    </Modal>
  );
};
