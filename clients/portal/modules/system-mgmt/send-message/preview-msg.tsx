import React from 'react';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import cs from 'classnames';

import FileList from '@c/file-upload/file-list';
import Loading from '@c/loading';
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
  className,
  isPreview,
}: Props): JSX.Element => {
  if (!prevData) {
    return (
      <Loading />
    );
  }

  const { title, content, receivers, types, type, creatorName, createdAt, files } = prevData;
  const msgType = typeof types !== 'undefined' ? types : type; // todo
  const fileList = files?.map((item) => ({
    uid: item.url || '',
    name: item.fileName || '',
    type: '',
    size: 0,
  })) || [];

  let txt = '';
  if (msgType === MsgType.notify) {
    txt = '通知公告';
  } else if (msgType === MsgType.system) {
    txt = '系统消息';
  } else {
    txt = '未知消息类型';
  }
  const infoText = [
    dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'), txt, creatorName || window.USER.name,
  ].join(' · ');

  const _content = !isPreview ? content : content.replace('contenteditable="true"', '');

  return (
    <div className={cs(styles.previewMsg, className)}>
      <div className={styles.previewMsgContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.info}>{infoText}</div>
        <div dangerouslySetInnerHTML={{ __html: _content }} />
        <FileList
          files={fileList}
          canDownload={true}
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
