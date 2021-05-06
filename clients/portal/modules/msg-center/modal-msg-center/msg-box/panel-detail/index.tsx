import React from 'react';
import { observer } from 'mobx-react';
import Loading from '@c/loading';
import styles from '../index.module.scss';
import PreviewMsg from '@portal/modules/system-mgmt/send-message/preview-msg';
import NoMsg from '../no-msg';
import msgCenter from '@portal/stores/msg-center';

const PanelDetail = () => {
  let messageDetail:any = {};
  const { loadingDetail } = msgCenter;

  if (loadingDetail) return <Loading />;
  messageDetail = msgCenter.messageDetail;

  if (!messageDetail) {
    return (
      <NoMsg noDetail tips='点击消息标题查看详情' />
    );
  } else {
    messageDetail.receivers = messageDetail.recivers;
  }

  return (
    <div className={styles.detailPanel}>
      <PreviewMsg prevData={messageDetail} hideReceivers isPreview canMultiDownload canDownload />
    </div>
  );
};

export default (observer(PanelDetail));
