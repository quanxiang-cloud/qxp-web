import React from 'react';
import { Modal } from '@QCFE/lego-ui';
import styles from './index.module.scss';
import Button from '@c/button';
import PreviewMsg from '../send-message/preview-msg';
import { MsgSendStatus } from '@portal/pages/system-mgmt/constants';

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

// eslint-disable-next-line react/prop-types
export const ModalContent = ({ status, visible, handleClose, confirmSend, data }: any) => {
  return (<div className={styles.preview_modal}>
    <Modal
      visible={visible}
      className={styles.previewModal}
      title={status == MsgSendStatus.draft ? '消息预览并发送' : '消息信息'}
      onCancel={handleClose}
      maskClosable={false}
      footer={(
        <div className="flex flex-row justify-between items-center">
          <Button
            className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
            iconName="close"
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
            modifier="primary"
            iconName="done"
            onClick={status == MsgSendStatus.draft ? confirmSend : handleClose}
          >
            {status == MsgSendStatus.draft ? '确定发送' : '确定'}
          </Button>
        </div>
      )}
    >
      <PreviewMsg prevData={data} />
    </Modal>
  </div>);
};

export default PreviewModal;

