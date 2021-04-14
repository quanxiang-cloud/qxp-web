import React from 'react';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import BtnBadge from '@containers/msg-center/btn-badge';
import { MsgType } from '@portal/const/message';

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

const Types = ({ className, msgCenter }: Props & Pick<MobxStores, any>) => {
  const { selectType, changeType, unReadCount }=msgCenter;

  const { announcement, systemMessage } = unReadCount;

  return (
    <ul className={styles.typePanel}>
      <TypeItem selected={selectType === MsgType.all} onClick={() => changeType(MsgType.all)} name='全部类型' count={announcement + systemMessage}/>
      <TypeItem selected={selectType === MsgType.notify} onClick={() => changeType(MsgType.notify)} name='通知公告' count={announcement}/>
      <TypeItem selected={selectType === MsgType.system} onClick={() => changeType(MsgType.system)} name='系统消息' count={systemMessage}/>
    </ul>
  );
};

export default inject('msgCenter')(observer(Types));
