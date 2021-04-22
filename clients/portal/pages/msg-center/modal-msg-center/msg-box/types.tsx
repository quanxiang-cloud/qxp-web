import React from 'react';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import BtnBadge from '@c/btn-badge';
import { MsgType } from '@portal/pages/system-mgmt/constants';

import styles from './index.module.scss';

interface ItemProps {
  name: string;
  count?: number;
  onClick: (...args: any[]) => void;
  selected?: boolean;
}

const TypeItem = ({ name, onClick, selected, count = 0 }: ItemProps) => {
  return (
    <li onClick={onClick} className={classNames({ [styles.active]: selected })}>
      <span>{name}</span>
      {count > 0 && <BtnBadge className={styles.float_count} count={count}/>}
    </li>
  );
};

interface Props {
  className?: string;
  onClick?: (...args: any[]) => void;
}

const Types = ({ className, msgCenter }: Props & Pick<MobxStores, 'msgCenter' | any>) => {
  const { selectType, changeType }=msgCenter;

  return (
    <ul className={styles.typePanel}>
      <TypeItem selected={selectType === MsgType.all} onClick={() => changeType(MsgType.all)} name='全部类型' count={msgCenter.countUnread}/>
      <TypeItem selected={selectType === MsgType.notify} onClick={() => changeType(MsgType.notify)} name='通知公告' count={msgCenter.countUnreadNotifyMsg}/>
      <TypeItem selected={selectType === MsgType.system} onClick={() => changeType(MsgType.system)} name='系统消息' count={msgCenter.countUnreadSystemMsg}/>
    </ul>
  );
};

export default inject('msgCenter')(observer(Types));
