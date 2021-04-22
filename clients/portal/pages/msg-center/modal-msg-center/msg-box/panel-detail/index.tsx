import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Loading from '@c/loading';
import styles from '../index.module.scss';
import PreviewMsg from '@portal/pages/system-mgmt/send-message/preview-msg';
import NoMsg from '../no-msg';

interface Props {
  className?: string;
}

const PanelDetail = ({ msgCenter }: Props & Pick<MobxStores, 'msgCenter' | any>) => {
  const { loadingDetail, messageDetail, curMsgId } = msgCenter;

  useEffect(()=> {

  }, [curMsgId]);

  if (loadingDetail) return <Loading />;

  if (messageDetail == null) {
    return (
      <NoMsg noDetail tips='点击消息标题查看详情' />
    );
  }

  const { recivers } = messageDetail;

  const data = Object.assign({}, messageDetail, {
    receivers: recivers || [],
  });

  return (
    <div className={styles.detailPanel}>
      <PreviewMsg prevData={data} hideReceivers isPreview />
    </div>
  );
};

export default inject('msgCenter')(observer(PanelDetail));
