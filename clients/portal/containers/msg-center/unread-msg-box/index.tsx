import React from 'react';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { useRouting } from '@portal/hooks';
import MsgList from './msg-list';

import styles from './index.module.scss';

const UnreadMsgBox = React.forwardRef((props: Pick<MobxStores, any>, ref: any) => {
  const [, queryPage]=useRouting();
  const { openUnreadMsgBox, openMsgCenter, unReadCount }=props.msgCenter;

  const toMsgCenter= (extParams?: object) => {
    openUnreadMsgBox(false);
    openMsgCenter(true);
    queryPage('', { msg_center: true, ...extParams });
  };

  return (
    <div ref={ref} className={classNames(styles.msgBox)}>
      <div className={styles.header}>
        <div className={classNames('text-h5', styles.title)}>
          <span>未读消息</span>
          <span className={styles.dot}/>
          <span>{unReadCount.announcement+unReadCount.systemMessage}</span>
        </div>
        <a onClick={()=>toMsgCenter({})} className='transition ease-linear text-1-dot-4 underline text-gray-600'>
          查看全部消息
        </a>
      </div>
      <div className={styles.body}>
        <MsgList getMsgDetail={toMsgCenter}/>
      </div>
    </div>
  );
});

export default inject('msgCenter')(observer(UnreadMsgBox));
