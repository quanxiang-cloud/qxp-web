import React from 'react';
import { observer } from 'mobx-react';

import Modal from '@c/modal';

import store from './store';

type Props = {
  onCancel: () => void;
  onAbandon: () => void;
}

function NotSavedModal({ onCancel, onAbandon }: Props): JSX.Element {
  const handleSave = (): void => {
    store.saveFormScheme().then(() => {
      onCancel();
    });
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
          forbidden: store.saveSchemeLoading,
        },
      ]}
    >
      当前有尚未保存的更改，离开当前页面前是否需要保存这些更改？
    </Modal>
  );
}

export default observer(NotSavedModal);
