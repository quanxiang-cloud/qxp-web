import React, { useState } from 'react';
import { observer } from 'mobx-react';

import Modal from '@c/modal';

interface Props {
  tokenSet: string;
  title: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

function editTokenSetModal({ tokenSet, title, onCancel, onSubmit }: Props): JSX.Element {
  const [name, setName] = useState<string>(tokenSet);

  return (
    <Modal
      title={title}
      onClose={onCancel}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: '确认',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: () => onSubmit(name),
        },
      ]}
    >
      <div className="flex flex-col justify-center px-20 py-4">
        <input
          className="w-full p-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="tokensetname"
          required
        />
      </div>
    </Modal>
  );
}

export default observer(editTokenSetModal);
