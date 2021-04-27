import React from 'react';
import cs from 'classnames';
import { inject, observer } from 'mobx-react';
import { useRouting } from '@portal/hooks';
import MsgList from './msg-list';

import styles from './index.module.scss';

const UnreadMsgBox = React.forwardRef(({ msgCenter }: Pick<MobxStores, 'msgCenter' | any>, ref: any) => {
  const [, queryPage]=useRouting();
  const { openUnreadMsgBox, openMsgCenter }=msgCenter;

  const toMsgCenter= (extParams?: object) => {
    openUnreadMsgBox(false);
    openMsgCenter(true);
    queryPage('', { msg_center: true, ...extParams });
  };

  return (
    <div ref={ref} className={cs(styles.msgBox)}>
      <div className={styles.header}>
        <div className={cs('text-h5', styles.title)}>
          <span>未读消息</span>
          <span className={styles.dot}/>
          <span>{msgCenter.countUnread}</span>
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
