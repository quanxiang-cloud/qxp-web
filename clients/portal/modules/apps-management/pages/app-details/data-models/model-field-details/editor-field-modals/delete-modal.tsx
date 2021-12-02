import React from 'react';

import Modal from '@c/modal';

type Props ={
  onClose: () => void;
  delConfirm: () => void;
}

function DeleteFieldModal({ onClose, delConfirm }: Props):JSX.Element {
  return (
    <Modal
      title="提示"
      onClose={onClose}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: delConfirm,
        },
      ]}
    >
      <p className="p-20">字段删除后不可恢复，是否继续删除？</p>
    </Modal>
  );
}

export default DeleteFieldModal;
