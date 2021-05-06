import React, { useState } from 'react';

import More from '@c/more';
import Icon from '@c/icon';

import ActionButtonGroup from './action-button-group';
import { removeNodeById } from '../../store';

interface Props {
  id: string;
}

export default function NodeRemover({ id }: Props) {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  function onRemoveNode() {
    removeNodeById(id);
  }

  return (
    <More
      placement="right-start"
      className="absolute right-10 top-1/2 transform -translate-y-1/2"
      contentClassName="left-full top-0 mt-0 w-316 p-20 cursor-default"
      contentItemClassName="hover:bg-white"
      open={showRemoveModal}
      items={[
        (
          <div key="remove-tip" className="mb-16" onClick={(e) => e.stopPropagation()}>
            <Icon name="info" className="text-yellow-600" />
            <span className="text-yellow-600 ml-8">是否删除该节点</span>
          </div>
        ),
        (
          <div key="remove-action" onClick={(e) => e.stopPropagation()}>
            <ActionButtonGroup
              onCancel={() => setShowRemoveModal(false)}
              onSubmit={onRemoveNode}
            />
          </div>
        ),
      ]}
    >
      <Icon
        name="cancel"
        type="dark"
        onClick={(e) => {
          setShowRemoveModal(true);
          e.stopPropagation();
        }}
      />
    </More>
  );
}
