import React from 'react';
import Modal from '@c/modal';

import Icon from '@c/icon';

import store from '../store';
import '../index.scss';

type Props = {
  appId: string;
  status: 'publish' | 'soldOut';
  onCancel: () => void;
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

function AppSetStatusModal({ onCancel, appId, status = 'publish' }: Props) {
  const handleSubmit = () => {
    store.updateAppStatus(appId, status === 'publish' ? 1 : -1).then(() => {
      onCancel();
    });
  };

  return (
    <Modal
      title={TEXT[status].modalTitle}
      onClose={onCancel}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: TEXT[status].sureText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
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

export default AppSetStatusModal;
