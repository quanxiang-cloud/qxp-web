import React from 'react';
import { Modal } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Button from '@c/button';

import '../index.scss';

type Props = {
  type: 'page' | 'group';
  visible: boolean;
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
    content: '删除分组后，分组下的二级菜单页面将默认变为一级页面。',
  },
};

function DelModal({ onCancel, visible, type = 'page', onOk }: Props) {
  return (
    <Modal
      visible={visible}
      title={TEXT[type].modalTitle}
      onCancel={onCancel}
      className="static-modal"
      footer={
        (<div className="flex items-center">
          <Button iconName='close' onClick={onCancel}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            modifier='primary'
            iconName='check'
            onClick={onOk}
          >
            {TEXT[type].sureText}
          </Button>
        </div>)
      }
    >
      <div className='flex-1'>
        <p className='app-status-modal-title text-yellow-600'>
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
