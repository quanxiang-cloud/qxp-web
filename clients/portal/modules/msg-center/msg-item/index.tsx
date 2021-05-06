import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { MsgReadStatus, MsgType } from '@portal/modules/system-mgmt/constants';
import msgCenter from '@portal/stores/msg-center';
import dayjs from 'dayjs';

import { Message } from '@QCFE/lego-ui';
import { useQueryClient, useMutation } from 'react-query';
import { getMsgById } from '@portal/modules/msg-center/api';

import { getQuery } from '@portal/utils';
import { useRouting } from '../hooks';

import styles from './index.module.scss';

interface Props {
  className?: string;
  hideType?: boolean;
  readonly?: boolean;
  onClick?: (...args: any[])=> void;
}

const MsgItem = ({
  id,
  title,
  updated_at,
  sort,
  read_status = 1,
  className,
  hideType,
  onClick,
  readonly,
}: Qxp.MsgItem & Props) => {
  const [read, setRead]=useState(read_status);
  const refItem=useRef(null);
  const queryPage = useRouting();
  const queryClient=useQueryClient();
  const { curMsgId }=msgCenter;

  useEffect(()=> {
    const msgId = getQuery('id') || msgCenter.curMsgId || '';
    if (msgId === id) {
      msgCenter.setCurMsgId(msgId);
      readMsg.mutate({
        queryKey: ['', {
          id,
          read: true,
        }],
      });
    }
  }, []);

  const checkRow=()=> {
    const activeCls='msg-item-active';
    if (refItem.current) {
      // @ts-ignore
      const trElem = refItem.current.parentNode.parentNode;
      if (curMsgId === id) {
        if (!trElem.classList.contains(activeCls)) {
          trElem.classList.add(activeCls);
        }
      } else {
        trElem.classList.remove(activeCls);
      }
    }
  };

  const readMsg = useMutation(getMsgById, {
    onMutate: ()=> {
      msgCenter.setLoadingDetail(true);
    },
    onSuccess: (data: any) => {
      msgCenter.setLoadingDetail(false);
      msgCenter.setDetail(data.data);
      // change msg read_status
      if (read_status === MsgReadStatus.unread) {
        setRead(MsgReadStatus.read);
        // todo
        queryClient.invalidateQueries('count-unread-msg');
      }
    },
    onError: (err: Error) => {
      msgCenter.setLoadingDetail(false);
      Message.error(err.message);
    },
  });

  const handleClick = () => {
    if (readonly) {
      return;
    }
    if (id !== msgCenter.curMsgId) {
      msgCenter.setCurMsgId(id);
      queryPage('', { id });

      readMsg.mutate({
        queryKey: ['', {
          id,
          read: true,
        }],
      });
    }

    checkRow();
    onClick && onClick();
  };

  useEffect(() => {
    checkRow();
  }, [curMsgId]);

  return (
    <div ref={refItem} className={cs(styles.msgItem, {
      [styles.active]: curMsgId === id,
    }, className)} onClick={handleClick}>
      <div className={styles.msgItemInner}>
        <span className='inline-flex items-center'>
          <span className={cs(styles.statusIcon, {
            [styles.statusUnread]: read === MsgReadStatus.unread,
            [styles.statusRead]: read === MsgReadStatus.read,
          })}/>
          <span className={styles.txt} title={title}>{title}</span>
        </span>
        {!hideType && (
          <span className={cs(styles.type, {
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

export default observer(MsgItem);
