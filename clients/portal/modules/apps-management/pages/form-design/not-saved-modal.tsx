import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';
import store from './store';

type Props = {
  onCancel: () => void;
}

function NotSavedModal({ onCancel }: Props) {
  const handleCancel = () => {
    store.reSetFormScheme();
    onCancel();
  };

  const handleSave = () => {
    store.saveFormScheme().then(() => {
      onCancel();
    });
  };
  return (
    <Modal
      visible
      title='提示'
      onCancel={onCancel}
      footer={
        (<div className="flex flex-row justify-between items-center">
          <Button
            onClick={handleCancel}
            className="mr-20"
          >
            否，放弃保存
          </Button>
          <Button
            modifier="primary"
            onClick={handleSave}
            disabled={store.saveSchemeLoading}
          >
            是，保存更改
          </Button>
        </div>)
      }
    >
      当前有尚未保存的更改，离开当前页面前是否需要保存这些更改？
    </Modal>
  );
}

export default observer(NotSavedModal);
