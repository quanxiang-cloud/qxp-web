import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { useQuery, useQueryClient } from 'react-query';
import { getUnreadMsgCount } from '@portal/api/message-center';
import Icon from '@c/icon';

import UnreadMsgBox from '../unread-msg-box';
import ModalMsgCenter from '../modal-msg-center';
import BtnBadge from '@c/btn-badge';
import pushServer from '@lib/push';
import { getQuery } from '@portal/utils';

import styles from './index.module.scss';

const NavMsgBar = ({ msgCenter: store }: Pick<MobxStores, 'msgCenter' | any>): JSX.Element => {
  const toggleRef = useRef(null);
  const msgBoxRef = useRef(null);
  const queryClient = useQueryClient();
  const { openUnreadMsgBox, msgBoxOpen, openMsgCenter, countUnread } = store;
  const { data: countUnreadMsg }=useQuery('count-unread-msg', getUnreadMsgCount);

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

  store.setUnreadTypeCounts(get(countUnreadMsg, 'data.type_num', []));

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
      <UnreadMsgBox ref={msgBoxRef}/>
    );
  };

  useEffect(() => {
    const listener = (data: any) => {
      // when new message come
      queryClient.invalidateQueries('count-unread-msg');
      queryClient.invalidateQueries('all-messages');
    };
    // todo newMessage? NewMessage? new_message?
    pushServer.addEventListener('newMessage', listener);

    return () => pushServer.removeEventListener('newMessage', listener);
  }, []);

  return (
    <>
      <div className={styles.wrap}>
        <div
          className={classNames('relative flex justify-center items-center cursor-pointer', styles.navItem)}
          onClick={() => openUnreadMsgBox(true)}
          ref={toggleRef}
        >
          <Icon
            name="notifications_active"
            size={20}
          />
          {countUnread > 0 && <BtnBadge className={styles.count_btn} count={countUnread}/>}
        </div>
        {renderUnreadMsgBox()}
      </div>
      <ModalMsgCenter />
    </>
  );
};

export default inject('msgCenter')(observer(NavMsgBar));
