import React, { useState, MouseEvent } from 'react';
import cs from 'classnames';

import More from '@c/more';
import Icon from '@c/icon';

import ActionButtonGroup from './action-button-group';
import { removeNodeById } from '../../store';

interface Props {
  id: string;
  type?: 'dark' | 'primary' | 'light';
  visible?: boolean;
}

export default function NodeRemover({ id, type = 'dark', visible = true }: Props) {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  function onRemoveNode() {
    removeNodeById(id);
  }

  function onMouseDown(e: MouseEvent) {
    e.stopPropagation();
  }

  function onMouseUp(e: MouseEvent) {
    e.stopPropagation();
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
          <div
            key="remove-tip"
            className="mb-16"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <Icon name="info" className="text-yellow-600" />
            <span className="text-yellow-600 ml-8">是否删除该节点</span>
          </div>
        ),
        (
          <div
            key="remove-action"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <ActionButtonGroup
              onCancel={() => setShowRemoveModal(false)}
              onSubmit={onRemoveNode}
            />
          </div>
        ),
      ]}
    >
      <Icon
        name="close"
        className={cs('transition-all', {
          'cursor-default': !visible,
          'pointer-events-none': !visible,
          'opacity-0': !visible,
          'opacity-1': visible,
        })}
        type={type}
        onClick={(e) => {
          setShowRemoveModal(true);
          e.stopPropagation();
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    </More>
  );
}
