import React from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '@c/modal';
import { useRouting } from '@portal/hooks';
import Toolbar from './toolbar';
import MsgBox from './msg-box';

const ModalMsgCenter = ({ msgCenter }: Pick<MobxStores, any>) => {
  const { msgCenterOpen, openMsgCenter } = msgCenter;
  const [, queryPage] = useRouting();

  const handleClose = () => {
    queryPage('', { msg_center: false });
    openMsgCenter(false);
  };

  if (!msgCenterOpen) {
    return null;
  }
  return (
    <Modal
      visible
      fullscreen
      title='消息中心'
      toolbar={(
        <Toolbar/>
      )}
      onClose={handleClose}
    >
      <MsgBox/>
    </Modal>
  );
};

export default inject('msgCenter')(observer(ModalMsgCenter));
