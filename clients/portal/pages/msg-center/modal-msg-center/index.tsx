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
      fullscreen
      width='100vw'
      title={
        (<div className='flex items-center'>
          <span className='mr-16'>消息中心</span>
          <Toolbar/>
        </div>)
      }
      onClose={handleClose}
    >
      <MsgBox/>
    </Modal>
  );
};

export default observer(ModalMsgCenter);
