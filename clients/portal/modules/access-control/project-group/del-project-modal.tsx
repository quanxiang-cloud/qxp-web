import React from 'react';

import Icon from '@c/icon';
import Modal from '@c/modal';

import store from './store';
import { Project } from './api';

type Props = {
  projectInfo: Project | undefined;
  onCancel: () => void;
}

function DelProjectModal({ onCancel, projectInfo }: Props): JSX.Element {
  const { delProject } = store;

  async function handleSubmit(): Promise<void> {
    await delProject(projectInfo?.id ?? '');
    onCancel();
  }

  return (
    <Modal
      title='删除项目'
      onClose={onCancel}
      className="static-modal"
      footerBtns={[{
        key: 'close',
        iconName: 'close',
        onClick: onCancel,
        text: '取消',
      }, {
        key: 'check',
        iconName: 'check',
        modifier: 'primary',
        onClick: handleSubmit,
        text: '删除项目',
      }]}
    >
      <div className='flex-1 p-20'>
        <p className='app-del-title mb-8'>
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='sms_failed' />
          确定要删除项目 {projectInfo?.name} 吗？
        </p>
      </div>
    </Modal>
  );
}

export default DelProjectModal;
