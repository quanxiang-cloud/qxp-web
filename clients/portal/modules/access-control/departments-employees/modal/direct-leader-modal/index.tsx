import React, { useState } from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';

import DirectLeaderPicker from './direct-leader-picker';

interface Props {
  title: string;
  submitText: string;
  current: Leader;
  onSubmit: (
    leader: Leader
  ) => Promise<boolean | void>;
  onCancel: () => void;
  employee?: Employee;
}

export default function DirectLeaderChoose({
  onSubmit,
  onCancel,
  title,
  submitText,
  current,
}: Props) {
  const [isOnGetSelected, setIsOnGetSelected] = useState(false);
  const [leader, setLeader] = useState<Leader>(current);
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
        currentLeader={leader}
        onChange={setLeader}
      />
    </Modal>
  );
}
