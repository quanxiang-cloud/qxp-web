import React from 'react';
import { Modal } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import SvgIcon from '@portal/components/icon';

interface DeleteModalProps {
  currDep: any;
  closeModal(): void;
  okModal(): void;
}

export default function DeleteModal({ currDep, closeModal, okModal }: DeleteModalProps) {
  return (
    <Modal
      visible
      title="删除"
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={<SvgIcon name="close" size={20} className="mr-8" />}
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="w-20"></div>
          <Button
            className="bg-black-900"
            textClassName="text-white"
            icon={<SvgIcon name="check" type="light" size={20} className="mr-8" />}
            onClick={okModal}
          >
            确定删除
          </Button>
        </div>
      }
    >
      <div className="text-14">
        确定要删除
        <span className="mx-2 text-16
        font-semibold text-gray-900">{currDep && currDep.departmentName}</span>
        吗？
      </div>
    </Modal>
  );
}
