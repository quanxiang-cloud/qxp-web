import React, { PropsWithChildren } from 'react';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';

type Props = PropsWithChildren<{
  title: string;
  onSubmit: () => void;
  onCancel: () => void;
}>

export default function ModalConfirm({ onCancel, onSubmit, title, children }: Props) {
  return (
    <Modal
      visible
      title={title}
      onCancel={onCancel}
      footer={
        (<div className="flex items-center">
          <Button
            iconName="close"
            className="mr-20"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            iconName="check"
            modifier="primary"
            onClick={onSubmit}
          >
            确定
          </Button>
        </div>)
      }
    >
      {children}
    </Modal>
  );
}
