import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { MsgType } from '@portal/modules/system-mgmt/constants';
import BtnBadge from '@c/btn-badge';
import msgCenter from '@portal/stores/msg-center';
import styles from './index.module.scss';

interface ItemProps {
  name: string;
  count?: number;
  onClick: (...args: any[]) => void;
  selected?: boolean;
}

const TypeItem = ({ name, onClick, selected, count = 0 }: ItemProps) => {
  return (
    <li onClick={onClick} className={cs({ [styles.active]: selected })}>
      <span>{name}</span>
      {count > 0 && <BtnBadge className={styles.float_count} count={count}/>}
    </li>
  );
};

interface Props {
  className?: string;
  onClick?: (...args: any[]) => void;
}

const Types = ({ className }: Props ) => {
  const { selectType, changeType } = msgCenter;

  return (
    <ul className={`${styles.typePanel} ${className}`}>
      <TypeItem
        selected={selectType === MsgType.all}
        onClick={() => changeType(MsgType.all)}
        name='全部类型'
        count={msgCenter.countUnread}
      />
      <TypeItem
        selected={selectType === MsgType.notify}
        onClick={() => changeType(MsgType.notify)}
        name='通知公告'
        count={msgCenter.countUnreadNotifyMsg}/>
      <TypeItem
        selected={selectType === MsgType.system}
        onClick={() => changeType(MsgType.system)}
        name='系统消息'
        count={msgCenter.countUnreadSystemMsg}/>
    </ul>
  );
};

export default observer(Types);
