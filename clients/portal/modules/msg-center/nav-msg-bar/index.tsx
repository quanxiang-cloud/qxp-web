import React, { useEffect, useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import msgCenter from '@portal/stores/msg-center';
import { useQuery, useQueryClient } from 'react-query';

import { getUnreadMsgCount } from '@portal/modules/msg-center/api';
import Icon from '@c/icon';

import { get } from 'lodash';
import UnreadMsgBox from '../unread-msg-box';
import ModalMsgCenter from '../modal-msg-center';
import BtnBadge from '@c/btn-badge';
import pushServer from '@lib/push';
import { getQuery } from '@portal/utils';

import styles from './index.module.scss';

type Props = {
  type?: string
  className?: string;
}

const NavMsgBar = ({ type, className }: Props): JSX.Element => {
  const toggleRef = useRef(null);
  const msgBoxRef = useRef(null);
  const queryClient = useQueryClient();
  const { openUnreadMsgBox, msgBoxOpen, openMsgCenter, countUnread } = msgCenter;
  const { data: countUnreadMsg } = useQuery('count-unread-msg', getUnreadMsgCount);

  const handleClickOuter = (ev: MouseEvent) => {
    const { target } = ev;
    if (!toggleRef.current || !msgBoxRef.current) {
      return;
    }
    // @ts-ignore
    if (!(toggleRef.current.contains(target) || msgBoxRef.current.contains(target))) {
      openUnreadMsgBox(false);
    }
  };

  useEffect(() => {
    msgCenter.setUnreadTypeCounts(get(countUnreadMsg, 'type_num', []));
  }, [countUnreadMsg]);

  useEffect(() => {
    document.body.addEventListener('click', handleClickOuter);

    // check params from url
    const queryOpenMsg = getQuery('msg_center');
    if (['true', '1'].includes(queryOpenMsg + '')) {
      openMsgCenter(true);
    }

    return () => {
      document.body.removeEventListener('click', handleClickOuter);
    };
  }, []);

  const renderUnreadMsgBox = () => {
    if (!msgBoxOpen) {
      return null;
    }
    return (
      <UnreadMsgBox ref={msgBoxRef} />
    );
  };

  useEffect(() => {
    const listener = () => {
      // when new message come
      queryClient.invalidateQueries('count-unread-msg');
      queryClient.invalidateQueries('all-messages');
    };
    // todo newMessage? NewMessage? new_message?
    pushServer.addEventListener('newMessage', 'newMessage', listener);

    return () => pushServer.removeEventListener('newMessage', 'newMessage');
  }, []);

  return (
    <>
      <div className={cs(className, styles.wrap, 'group')}>
        <div
          className={cs(
            'relative cursor-pointer text-blue-100',
            styles.navItem,
            {
              'text-gray-50 group-hover:bg-blue-500': type !== 'portal',
              'text-gray-400 group-hover:bg-gray-100 hover:text-gray-600': type === 'portal',
            },
          )}
          onClick={() => openUnreadMsgBox(true)}
          ref={toggleRef}
        >
          <Icon
            size={20}
            name="home_bell"
            style={{ fill: `${type === 'portal' ? 'var(--gray-400)' : 'var(--blue-100)'}` }}
            className="m-6"
          />
          {countUnread > 0 && <BtnBadge className={styles.count_btn} count={countUnread} />}
        </div>
        {renderUnreadMsgBox()}
      </div>
      <ModalMsgCenter />
    </>
  );
};

export default observer(NavMsgBar);
