import React, { useEffect } from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import PullRefresh from '@m/qxp-ui-mobile/pull-refresh';
import List from '@m/qxp-ui-mobile/list';
import { Empty } from '@m/qxp-ui-mobile/empty';
import { messagesPath } from '@m/constant';
import msgCenter from '@portal/stores/msg-center';
import { Message } from '../types';

import { MessageTabProps } from './constant';
import Filter from './filter';
import { store } from './store';

const MessageTab = (props: MessageTabProps): JSX.Element => {
  const { empty, type } = props;

  const history = useHistory();

  useEffect(() => store[type].clear, []);

  let unread;
  switch (type) {
  case 'all':
    unread = msgCenter.countUnread;
    break;
  case 'system':
    unread = msgCenter.countUnreadSystemMsg;
    break;
  case 'notice':
    unread = msgCenter.countUnreadNotifyMsg;
    break;
  }

  function onMessageClick(message: Message, index: number): void {
    history.push(`${messagesPath}/${message.id}`);
    store[type].read(message, index);
  }

  return (
    <div className='overflow-scroll flex flex-col'
      style={{ height: 'calc(100vh - 0.44rem - 0.42rem - 1px)' }}>
      <Filter unread={unread} onClickReadAll={store[type].readAll}/>
      <PullRefresh
        onRefresh={() => store[type].loadMessages(1)}
        className='flex-1'>
        <List finished={store[type].finished}
          onLoad={() => store[type].loadMessages(store[type].page + 1)}
          className='h-full overflow-scroll safe-area-bottom'>
          {store[type].list.length > 0 && (store[type].list.map((message, index) =>
            (
              <div className='padding-16 flex text-secondary body1 pointer'
                onClick={() => onMessageClick(message, index)}
                key={message.id}>
                <div className={cs('flex-1 truncate', {
                  'text-placeholder': message.readStatus === 2,
                })}>
                  {message.title}
                </div>
                <div className='body2 text-placeholder'>{message.updated}</div>
              </div>
            )))
          }
          {store[type].list.length < 1 && store[type].inited && <Empty {...empty}/>}
        </List>
      </PullRefresh>
    </div>
  );
};

export default observer(MessageTab);
