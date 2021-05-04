import React from 'react';
import { Checkbox } from '@QCFE/lego-ui';
import { throttle } from 'lodash';
import { inject, observer } from 'mobx-react';
import { useQueryClient } from 'react-query';
import Icon from '@c/icon';
import { MsgReadStatus } from '@portal/modules/system-mgmt/constants';

const Toolbar = ({ msgCenter }: Pick<MobxStores, 'msgCenter' | any>) => {
  const { countUnread, filterCheckUnread, setUnreadFilter }=msgCenter;
  const queryClient=useQueryClient();

  const onChangeUnreadType=(ev: any, checkUnread: boolean)=> {
    setUnreadFilter(checkUnread);
    msgCenter.reset();
  };

  const refetch=()=> {
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
      <Icon name='cached' size={20} className='cursor-pointer' onClick={throttle(refetch, 1000)}/>
    </div>
  );
};

export default inject('msgCenter')(observer(Toolbar));
