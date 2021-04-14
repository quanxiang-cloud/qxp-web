import React from 'react';
import classNames from 'classnames';
import { MsgReadStatus, MsgType } from '@portal/const/message';
import dayjs from 'dayjs';

import styles from './index.module.scss';

interface Props {
  className?: string;
  hideType?: boolean;
}

const MsgItem = ({
  id,
  title,
  updated_at,
  sort,
  read_status = 1,
  className,
  hideType,
}: Qxp.MsgItem & Props) => {
  return (
    <div className={classNames(styles.msgItem, className)}>
      <div className={styles.msgItemInner}>
          <span>
            <span className={classNames(styles.statusIcon, {
              [styles.statusUnread]: read_status === MsgReadStatus.unread,
              [styles.statusRead]: read_status === MsgReadStatus.read,
            })}/>
            <span className={styles.txt}>{title}</span>
          </span>
          {!hideType && (
            <span className={classNames(styles.type, {
              [styles.system]: sort === MsgType.system,
              [styles.alert]: sort === MsgType.notify,
            })}>
              {sort === MsgType.system ? '系统消息' : '通知公告'}
            </span>
          )}
        </div>
        <div className={styles.msg_itm_time}>
          <span className={styles.time}>
            {dayjs(parseInt(String(updated_at * 1000))).format('YYYY-MM-DD HH:mm')}
          </span>
        </div>
    </div>

  );
};

export default MsgItem;
