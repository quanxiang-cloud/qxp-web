import React from 'react';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import cs from 'classnames';
import Loading from '@c/loading';
import FileList from './filelist';
import { MsgType } from '@portal/modules/system-mgmt/constants';

interface Props {
  className?: string;
  prevData: Qxp.DraftData | null;
  hideReceivers?: boolean;
  isPreview?: boolean;
  canDownload?: boolean;
  canMultiDownload?: boolean;
}

const PreviewMsg = ({
  prevData,
  hideReceivers,
  isPreview,
  canDownload,
  canMultiDownload,
  className,
}: Props): JSX.Element => {
  if (!prevData) {
    return (
      <Loading />
    );
  }

  const { title, content, receivers, sort, type, handle_name, update_at } = prevData;
  const msgType = typeof sort !== 'undefined' ? sort : type; // todo

  let txt = '';
  if (msgType === MsgType.notify) {
    txt = '通知公告';
  } else if (msgType === MsgType.system) {
    txt = '系统消息';
  } else {
    txt = '未知消息类型';
  }
  const infoText = [
    dayjs(update_at * 1000).format('YYYY-MM-DD HH:mm:ss'), txt, handle_name || window.USER.userName,
  ].join(' · ');

  return (
    <div className={cs(styles.previewMsg, className)}>
      <div className={styles.previewMsgContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>{infoText}</div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <FileList
          candownload={canDownload}
          files={(prevData.mes_attachment || [])}
          hideProgress
          isPreview={isPreview}
          canMultiDownload={canMultiDownload}
          messageTitle={title}
        />
      </div>

      {
        !hideReceivers && (
          <div className={styles.pre_receivers}>
            <div className={styles.pre_receivers_title}>该消息将发送至:</div>
            {receivers && receivers.map(({ id, type, name }) => (<span
              className={cs(styles.person, {
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
