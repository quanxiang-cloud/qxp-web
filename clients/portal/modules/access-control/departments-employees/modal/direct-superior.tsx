import React, { useState } from 'react';
import { Input } from 'antd';

import Button from '@c/button';

import DirectLeaderChoose from './direct-leader-modal';

interface Props {
  value?: Leader;
  onChange?: (value: Leader) => void;
}

function DirectSuperior({ value, onChange }: Props): JSX.Element {
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [leader, setLeader] = useState<Leader>({
    id: value ? value.id : '',
    userName: value ? value.userName : '',
  });

  async function onAssociate( leader: Leader): Promise<any> {
    setLeader(leader);
    onChange && onChange(leader);
    setShowLeaderModal(false);
  }

  return (
    <div className="flex items-center leaderName">
      <Input
        className="flex-1 grid"
        value={leader.userName}
        placeholder="直属上级姓名"
      />
      <Button
        modifier="primary"
        className="ml-32"
        iconName="link"
        onClick={() => setShowLeaderModal(true)}
      >
        关联直属上级
      </Button>
      {showLeaderModal && (
        <DirectLeaderChoose
          title="关联直属上级"
          submitText="确定关联"
          onSubmit={onAssociate}
          onCancel={() => setShowLeaderModal(false)}
          current={leader}
        />
      )}
    </div>
  );
}

export default DirectSuperior;
