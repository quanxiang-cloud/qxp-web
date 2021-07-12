import React from 'react';
import styles from './index.module.scss';
import Modal from '@c/modal';
import PreviewMsg from '../send-message/preview-msg';
import { MsgSendStatus } from '@portal/modules/system-mgmt/constants';

interface Props {
  handleClick: () => void
  title: string | JSX.Element
}

const PreviewModal = ({ title, handleClick }: Props) => {
  return (
    <div
      onClick={handleClick}
      className={styles.pre_modal_hover_title}>{title}
    </div>
  );
};

export const ModalContent = ({ status, handleClose, confirmSend, data }: any) => {
  return (
    <Modal
      width={988}
      title={status == MsgSendStatus.draft ? '消息预览并发送' : '消息详情'}
      onClose={handleClose}
      footerBtns={[
        {
          text: status == MsgSendStatus.draft ? '确定发送' : '确定',
          key: 'send',
          iconName: 'send',
          modifier: 'primary',
          onClick: status == MsgSendStatus.draft ? confirmSend : handleClose,
        },
      ]}
    >
      <PreviewMsg className="p-20" prevData={data} isPreview />
    </Modal>
  );
};

export default PreviewModal;

