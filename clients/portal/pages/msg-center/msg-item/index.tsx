import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import { inject, observer } from 'mobx-react';
import { MsgReadStatus, MsgType } from '@portal/pages/system-mgmt/constants';
import dayjs from 'dayjs';
import { useRouting } from '@portal/hooks';
import { Message } from '@QCFE/lego-ui';
import { useQueryClient, useMutation } from 'react-query';
import { getMsgById } from '@portal/api/message-center';
import { getQuery } from '@portal/utils';

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
  msgCenter: store,
}: Qxp.MsgItem & Props & Pick<MobxStores, 'msgCenter' | any>) => {
  const [read, setRead]=useState(read_status);
  const refItem=useRef(null);
  const [, queryPage]=useRouting();
  const queryClient=useQueryClient();
  const { curMsgId }=store;

  useEffect(()=> {
    const msgId = getQuery('id') || store.curMsgId || '';
    if (msgId === id) {
      store.setCurMsgId(msgId);
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
      store.setLoadingDetail(true);
    },
    onSuccess: (data: any) => {
      store.setLoadingDetail(false);
      store.setDetail(data.data);
      // change msg read_status
      if (read_status === MsgReadStatus.unread) {
        setRead(MsgReadStatus.read);
        // todo
        queryClient.invalidateQueries('count-unread-msg');
      }
    },
    onError: (err: Error) => {
      store.setLoadingDetail(false);
      Message.error(err.message);
    },
  });

  const handleClick = () => {
    if (readonly) {
      return;
    }
    if (id !== store.curMsgId) {
      store.setCurMsgId(id);
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

export default inject('msgCenter')(observer(MsgItem));
