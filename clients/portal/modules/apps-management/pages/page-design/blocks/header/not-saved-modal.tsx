import React from 'react';

import Modal from '@c/modal';

type Props = {
  onCancel: () => void;
  onSave: () => void
  onAbandon: () => void;
}

function NotSavedModal({ onAbandon, onSave, onCancel }: Props): JSX.Element {
  const handleSave = (): void => {
    onSave();
    onAbandon();
  };
  return (
    <Modal
      title='提示'
      onClose={onCancel}
      footerBtns={[
        {
          key: '1',
          text: '否，放弃保存',
          onClick: onAbandon,
          className: 'mr-20',
        },
        {
          key: '2',
          text: '是，保存更改',
          modifier: 'primary',
          onClick: handleSave,
          className: 'mr-20',
        },
      ]}
    >
      <p className="p-20">当前有尚未保存的更改，离开当前页面前是否需要保存这些更改？</p>
    </Modal>
  );
}

export default NotSavedModal;
