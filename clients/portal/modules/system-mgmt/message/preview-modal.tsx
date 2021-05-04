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
  // const [data, setData] = useState(null)
  // const [visible, setVisible] = useState(false)

  // useEffect(() => {
  //     if (!visible) return
  //     setData(null)
  //     getMsgById(id)
  //         .then(response => {
  //             if (response.code == 0) {
  //                 const { recivers } = response.data
  //                 setData(Object.assign({}, response.data, { receivers: recivers }))
  //             } else {
  //                 Message.warning("异常查询")
  //             }
  //         })
  // }, [id, visible])

  // const handleClose = () => setVisible(false)

  // const confirmSend = () => {
  //     if (status != MsgSendStatus.draft) return handleClose()

  // }

  return (<div >
    <div
      // onClick={(e) => {
      //     e.stopPropagation()
      //     setVisible(true)
      // }}
      onClick={handleClick}
      className={styles.pre_modal_hover_title}>{title}</div>

    {/* <ModalContent {...{ status, visible, handleClose, confirmSend, data }} /> */}
  </div>);
};

export const ModalContent = ({ status, handleClose, confirmSend, data }: any) => {
  return (
    <Modal
      width={988}
      title={status == MsgSendStatus.draft ? '消息预览并发送' : '消息详情'}
      onClose={handleClose}
      onConfirm={status == MsgSendStatus.draft ? confirmSend : handleClose}
      okText={status == MsgSendStatus.draft ? '确定发送' : '确定'}
    >
      <PreviewMsg prevData={data} isPreview />
    </Modal>
  );
};

export default PreviewModal;

