import React from 'react';
import { inject } from 'mobx-react';
import { Modal } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Button from '@appC/button';

import '../index.scss';

type Props = {
  appId: string;
  status: 'publish' | 'soldOut';
  onCancel: () => void;
  appListStore?: any;
}

const TEXT = {
  publish: {
    modalTitle: '发布应用',
    sureText: '确认发布应用',
    title: '确定要发布该应用吗？',
    content: '应用发布后，即可在访问端使用，请确保应用下的功能均经过测试且切实有效，避免因功能设置问题给他人造成不必要的影响。',
  },
  soldOut: {
    modalTitle: '下架应用',
    sureText: '确认下架应用',
    title: '确定要下架该应用吗？',
    content: '下线后此应用访问端不可使用，如需再次使用请发布应用！',
  },
};

function AppSetStatusModal({ onCancel, appId, status = 'publish', appListStore }: Props) {
  const handleSubmit = () => {
    appListStore.updateAppStatus(appId, status === 'publish' ? 1 : -1).then(() => {
      onCancel();
    });
  };

  return (
    <Modal
      visible
      title={TEXT[status].modalTitle}
      onCancel={onCancel}
      className="static-modal"
      footer={
        (<div className="flex items-center">
          <Button icon='close' onClick={onCancel}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            isPrimary
            icon='check'
            onClick={handleSubmit}
          >
            {TEXT[status].sureText}
          </Button>
        </div>)
      }
    >
      <div className='flex-1'>
        <p className='app-status-modal-title text-yellow-600'>
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='error_outline' />
          {TEXT[status].title}
        </p>
        <p className='pl-28'>
          {TEXT[status].content}
        </p>
      </div>
    </Modal>
  );
}

export default inject('appListStore')(AppSetStatusModal);
