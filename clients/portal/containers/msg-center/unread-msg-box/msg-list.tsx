import React from 'react';
import classNames from 'classnames';
import { useQuery } from 'react-query';
import { getMessages } from '@portal/pages/system-mgmt/api/message-center';
import Loading from '@c/loading';
import Error from '@c/error';
import MsgItem from '../msg-item';
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
        {msgList.map((msg: Qxp.MsgItem) => (<div onClick={()=>handleClick(msg.id)} className='hover:bg-gray-100' key={msg.id} >
          <MsgItem {...msg} />
        </div>))}
      </ul>
    );
  };

  const { isLoading, isError, data } = useQuery(['unread-messages', { limit: 5 }], getMessages, {
    // initialData: mockMsgList,
    // staleTime: 1000 * 60 * 60,
    cacheTime: -1,
  });

  if (isLoading) {
    return <Loading/>;
  }
  if (isError) {
    return <Error desc='获取数据失败' />;
  }

  const msgList = data?.data?.mes_list || [];
  return (
    <div className={classNames(styles.msgList, className)}>
      {renderMain(msgList)}
    </div>
  );
};

export default MsgList;
