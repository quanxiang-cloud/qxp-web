import React from 'react';

import Icon from '@c/icon';
import Modal from '@c/modal';
import toast from '@lib/toast';

import { deleteTemplate } from '../api';

type Props = {
  appInfo: AppInfo;
  onCancel: () => void;
}

function DelTemplateModal({ onCancel, appInfo }: Props): JSX.Element {
  function handleSubmit(): void {
    deleteTemplate(appInfo.id).then(() => {
      toast.success('模版删除成功');
      onCancel();
    }).catch(() => {
      toast.error('模版删除成功');
    });
  }

  return (
    <Modal
      title='删除模版'
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
        text: '删除模版',
      }]}
    >
      <div className='flex-1 p-20'>
        <p className='app-del-title mb-8'>
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='sms_failed' />
          确定要删除模版 {appInfo?.appName} 吗？
        </p>
      </div>
    </Modal>
  );
}

export default DelTemplateModal;
