import React from 'react';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import classNames from 'classnames';
import Loading from '@c/loading';
import FileList from './filelist';
import { MsgType } from '@portal/pages/system-mgmt/constants';

interface Props {
  className?: string;
  prevData: Qxp.DraftData | null;
  hideReceivers?: boolean;
}

const PreviewMsg = ({ prevData, hideReceivers }: Props) => {
  if (!prevData) {
    return (
      <Loading />
    );
  }

  const { title, content, receivers, sort, handle_name }=prevData;

  let txt = '';
  if (sort === MsgType.notify) {
    txt = '通知公告';
  } else if (sort === MsgType.system) {
    txt = '系统消息';
  } else {
    txt = '未知消息类型';
  }

  return (
    <div className={styles.previewMsg}>
      <div className={styles.previewMsgContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>{dayjs().format('YYYY-MM-DD HH:mm:ss')} {txt} {handle_name}</div>
        <div dangerouslySetInnerHTML={{ __html: content }} />

        <FileList candownload files={ (prevData.mes_attachment || [])} hideProgress />
      </div>

      {
        !hideReceivers && (
          <div className={styles.pre_receivers}>
            <div className={styles.pre_receivers_title}>该消息将发送至:</div>
            {receivers && receivers.map(({ id, type, name }) => (<span
              className={classNames(styles.person, {
                [styles.isDep]: type === 2,
                [styles.isPerson]: type === 1,
              })}
              key={id}
            >
              <span>{name}</span>
            </span>))}
          </div>
        )
      }
    </div>
  );
};

export default PreviewMsg;
