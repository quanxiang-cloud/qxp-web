import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';

import Modal from '@c/modal';

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
  title?: ReactNode;
  text?: ReactNode
}

function ConfirmModal({
  onSubmit,
  onCancel,
  text,
  title,
}: Props): JSX.Element {
  return (
    <Modal
      title={title}
      className="static-modal"
      onClose={onCancel}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: onSubmit,
        },
      ]}
    >
      {text}
    </Modal>
  );
}

export default observer(ConfirmModal);
