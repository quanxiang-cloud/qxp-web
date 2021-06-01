import React, { useState } from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';

import DirectLeaderPicker from './direct-leader-picker';

interface Props {
  title: string;
  submitText: string;
  onSubmit: (
    leader: Leader
  ) => Promise<boolean | void>;
  onCancel: () => void;
  employee?: Employee;
}

export default function DirectLeaderChoose({
  employee,
  onSubmit,
  onCancel,
  title,
  submitText,
}: Props) {
  const [isOnGetSelected, setIsOnGetSelected] = useState(false);
  const [leader, setLeader] = useState<Leader>({
    id: '',
    userName: '',
  });
  function onGetSelected() {
    if (!leader.id.length) {
      toast.error('您还未关联直属上级');
    }
    setIsOnGetSelected(true);
    onSubmit(leader);
  }

  return (
    <Modal
      title={title}
      onClose={onCancel}
      width={1234}
      height={760}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: submitText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          loading: isOnGetSelected,
          onClick: onGetSelected,
        },
      ]}
    >
      <DirectLeaderPicker
        employee={employee}
        onChange={setLeader}
      />
    </Modal>
  );
}
