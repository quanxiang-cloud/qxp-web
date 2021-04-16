import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Loading from '@c/loading';
import styles from '../index.module.scss';
import PreviewMsg from '@portal/pages/system-mgmt/send-message/preview-msg';

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
      <div className={styles.detailPanel}>
        <div className={styles.noData} />
      </div>
    );
  }

  const { recivers } = messageDetail;

  const data = Object.assign({}, messageDetail, { receivers: recivers || [] });

  return (
    <div className={styles.detailPanel}>
      <PreviewMsg prevData={data} />
    </div>
  );
};

export default inject('msgCenter')(observer(PanelDetail));
