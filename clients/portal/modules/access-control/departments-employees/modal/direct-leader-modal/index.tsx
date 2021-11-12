import React, { useState } from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';

import DirectLeaderPicker from './direct-leader-picker';

export type ActionStatus = 'transfer' | 'direct';

interface Props {
  title: string;
  submitText: string;
  current: Leader;
  onSubmit: (
    leader: Leader
  ) => Promise<boolean | void>;
  onCancel: () => void;
  employee?: Employee;
  actionStatus?: ActionStatus;
}

export default function DirectLeaderChoose({
  onSubmit,
  onCancel,
  title,
  submitText,
  current,
  actionStatus = 'direct',
}: Props): JSX.Element {
  const [isOnGetSelected, setIsOnGetSelected] = useState(false);
  const [leader, setLeader] = useState<Leader>(current);

  function onGetSelected(): void {
    if (!leader.id) {
      toast.error('您还未选择指定人员！');
      return;
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
        className="p-20"
        currentLeader={leader}
        onChange={setLeader}
        actionStatus={actionStatus}
      />
    </Modal>
  );
}
