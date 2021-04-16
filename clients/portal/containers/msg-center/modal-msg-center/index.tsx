import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '@c/modal';
import { useRouting } from '@portal/hooks';
import Toolbar from './toolbar';
import MsgBox from './msg-box';

const ModalMsgCenter = ({ msgCenter }: Pick<MobxStores, 'msgCenter' | any>) => {
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
      fullscreen
      width='100vw'
      hideFooter
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
