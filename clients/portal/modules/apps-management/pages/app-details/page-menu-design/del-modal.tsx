import React from 'react';
import Modal from '@c/modal';
import Icon from '@c/icon';

import '../index.scss';

type Props = {
  type: 'page' | 'group';
  onCancel: () => void;
  onOk: () => void;
}

const TEXT = {
  page: {
    modalTitle: '删除页面',
    sureText: '确认删除页面',
    title: '确定要删除页面吗？',
    content: '删除页面后，该菜单的数据将无法找回。    ',
  },
  group: {
    modalTitle: '删除分组',
    sureText: '确认删除分组',
    title: '确定要删除分组吗？ ',
    content: '',
  },
};

function DelModal({ onCancel, type = 'page', onOk }: Props): JSX.Element {
  return (
    <Modal
      title={TEXT[type].modalTitle}
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
          text: TEXT[type].sureText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: onOk,
        },
      ]}
    >
      <div className='flex-1 p-20'>
        <p className='app-status-modal-title text-yellow-600 mb-16'>
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='error_outline' />
          {TEXT[type].title}
        </p>
        <p className='pl-28'>
          {TEXT[type].content}
        </p>
      </div>
    </Modal>
  );
}

export default DelModal;
