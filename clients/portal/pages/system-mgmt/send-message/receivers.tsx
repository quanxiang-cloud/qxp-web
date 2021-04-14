import React from 'react';

import styles from './index.module.scss';
import classNames from 'classnames';
import Icon from '@c/icon';

interface Props {
  className?: string;
  receivers: Array<Qxp.MsgReceiver>;
  readonly?: boolean;
  onRemove?: (id: string)=> void;
}

const Receivers = ({
  className,
  receivers,
  readonly,
  onRemove,
}: Props) => {
  return (
    <div className={classNames(styles.receivers, className)}>
      {receivers.map(({ id, name, type }: Qxp.MsgReceiver) => {
        return (
          <span className={classNames(styles.person, {
            [styles.isDep]: type === 2,
            [styles.isPerson]: type === 1,
          })} key={id}>
            <span>{name}</span>
            {!readonly && <Icon name='close' className={styles.close} onClick={() => onRemove && onRemove(id)}/>}
          </span>
        );
      })}
    </div>
  );
};

export default Receivers;
