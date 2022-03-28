import React, { useState } from 'react';

import Modal from '@c/modal';

import { View, CreateViewParams } from '../types.d';
import StaticViewUpload from '../static-view-upload';

type Props = {
  onClose: () => void;
  onSubmit: (viewInfo: (CreateViewParams & { layoutType: string, fileUrl: string, link: string }),) => void;
  view?: View;
}

function EditStaticViewModal({ view, onClose, onSubmit }: Props): JSX.Element {
  const [fileUrl, setFileUrl] = useState<string>('');

  function handleSubmit(): void {
    onSubmit({ ...view, fileUrl } as any);
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
