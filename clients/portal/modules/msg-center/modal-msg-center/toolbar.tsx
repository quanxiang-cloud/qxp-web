import React from 'react';
import Checkbox from '@c/checkbox';
import { throttle } from 'lodash';
import { observer } from 'mobx-react';
import { useQueryClient } from 'react-query';
import Icon from '@c/icon';
import { MsgReadStatus } from '@portal/modules/system-mgmt/constants';
import msgCenter from '@portal/stores/msg-center';

const Toolbar = () => {
  const { countUnread, filterCheckUnread, setUnreadFilter } = msgCenter;
  const queryClient = useQueryClient();
  const onChangeUnreadType = (ev: any) => {
    setUnreadFilter(ev.target.checked);
    msgCenter.reset();
  };

  const refetch = () => {
    queryClient.invalidateQueries('all-messages');
    msgCenter.reset();
  };

  return (
    <div className='flex justify-center items-center'>
      <div className={'mr-20 leading-20 text-toolbar inline-flex'}>
        <Checkbox
          className='relative top-2'
          defaultChecked={filterCheckUnread}
          value={filterCheckUnread ? MsgReadStatus.unread : MsgReadStatus.all}
          onChange={onChangeUnreadType}
        />
        <span className='ml-8'>仅看未读</span>
        <span className='ml-8'>({countUnread})</span>
      </div>
      <Icon name='cached' size={20} className='cursor-pointer' onClick={throttle(refetch, 1000)} />
    </div>
  );
};

export default observer(Toolbar);
