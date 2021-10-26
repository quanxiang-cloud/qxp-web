import React from 'react';

import Modal from '@c/modal';

type Props = {
  onOk: () => void;
  onCancel: () => void;
  pageInfo?: Menu;
}

function HidePageConfirmModal({ onCancel, onOk, pageInfo }: Props): JSX.Element {
  return (
    <Modal
      title="提示"
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
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: onOk,
        },
      ]}
    >
      <p className="p-20">{pageInfo?.isHide ? '设置显示页面，访问端将能查看此页面' : '设置隐藏页面，访问端将无法查看此页面'}</p>
    </Modal>
  );
}

export default HidePageConfirmModal;
