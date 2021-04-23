import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Modal from '@c/modal';
import { useRouting } from '@portal/hooks';

import Toolbar from './toolbar';
import MsgBox from './msg-box';
import msgCenter from '../../../stores/msg-center';

const ModalMsgCenter = () => {
  const { msgCenterOpen, openMsgCenter } = msgCenter;
  const [, queryPage] = useRouting();

  useEffect(() => {
    return () => {
      msgCenter.reset && msgCenter.reset();
    };
  }, []);

  const handleClose = () => {
    queryPage('', {
      msg_center: false,
      id: undefined,
    });
    openMsgCenter(false);
  };

  if (!msgCenterOpen) {
    return null;
  }

  return (
    <Modal
      visible
      hideFooter
      fullscreen
      width='100vw'
      title='消息中心'
      toolbar={(<Toolbar/>)}
      onClose={handleClose}
    >
      <MsgBox/>
    </Modal>
  );
};

export default observer(ModalMsgCenter);
