import React, { useState } from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';

import StaticViewUpload from '../static-view-upload';

import type { StaticView } from '../types.d';

type Props = {
  onClose: () => void;
  onSubmit: (viewInfo: StaticView) => void;
  view?: StaticView;
}

function EditStaticViewModal({ view, onClose, onSubmit }: Props): JSX.Element {
  const [fileUrl, setFileUrl] = useState<string>('');

  function handleSubmit(): void {
    if (!fileUrl) {
      toast.error('请上传正确的文件');
      return;
    }
    onSubmit({ ...view, fileUrl } as StaticView );
  }

  return (
    <Modal
      title="修改静态页面"
      onClose={onClose}
      footerBtns={[
        {
          key: 'close',
          text: '取消',
          onClick: onClose,
        },
        {
          key: 'sure',
          text: '确定',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <StaticViewUpload onChange={setFileUrl} />
    </Modal>
  );
}

export default EditStaticViewModal;
