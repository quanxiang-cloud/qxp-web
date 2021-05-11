import React from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';
import { getMessageList } from '@portal/modules/msg-center/api';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import MsgItem from '../msg-item';
import { MsgReadStatus } from '@portal/modules/system-mgmt/constants';
// import {default as mockMsgList} from '@portal/mock/mock-msg-list';

import styles from './index.module.scss';

interface Props {
  className?: string;
  getMsgDetail?: (obj?: any)=> void;
}

const NoMsg = () => (
  <div className={styles.noMsg}>
    <img className="w-4-dot-8 h-4-dot-8 mb-dot-6" src="/dist/images/alert.svg" alt="alert"/>
    <span className="text-1-dot-2 text-blue-400">无未读消息</span>
  </div>
);

const MsgList = ({ className, getMsgDetail }: Props): JSX.Element => {
  const renderMain = (msgList: any) => {
    if (!msgList.length) {
      return (
        <ul className={styles.items}>
          <NoMsg/>
        </ul>
      );
    }

    const handleClick = (id: any) =>{
      // @ts-ignore
      getMsgDetail({ id });
    };

    return (
      <ul className={styles.items}>
        {msgList.map((msg: Qxp.MsgItem) => (
          <div
            onClick={()=>handleClick(msg.id)}
            className='hover:bg-gray-100'
            key={msg.id}
          >
            <MsgItem {...msg} readonly />
          </div>))
        }
      </ul>
    );
  };

  const { isLoading, isError, data } = useQuery(['unread-messages', {
    read_status: MsgReadStatus.unread,
    page: 1,
    limit: 5,
  }], getMessageList, {
    cacheTime: -1,
  });

  if (isLoading) {
    return <Loading/>;
  }
  if (isError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  const msgList = data?.mes_list || [];
  return (
    <div className={cs(styles.msgList, className)}>
      {renderMain(msgList)}
    </div>
  );
};

export default MsgList;
