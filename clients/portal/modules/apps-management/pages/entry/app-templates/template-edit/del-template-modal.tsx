import React from 'react';

import Icon from '@c/icon';
import Modal from '@c/modal';

import store from '../store';

type Props = {
  templateInfo: TemplateInfo;
  onCancel: () => void;
}

function DelTemplateModal({ onCancel, templateInfo }: Props): JSX.Element {
  const { delTemplate } = store;

  async function handleSubmit(): Promise<void> {
    await delTemplate(templateInfo.id ?? '');
    onCancel();
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
          确定要删除模版 {templateInfo?.appName} 吗？
        </p>
      </div>
    </Modal>
  );
}

export default DelTemplateModal;
