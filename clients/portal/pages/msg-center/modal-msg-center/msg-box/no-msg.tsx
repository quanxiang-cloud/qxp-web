import React from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';

interface Props {
  tips?: string;
  className?: string;
  noDetail?: boolean;
}

const NoMsg = ({ tips, className, noDetail }: Props) => {
  return (
    <div className={classNames(styles.noMsg, className)}>
      <div className={classNames(styles.picNoMsg, { [styles.picNoDetail]: noDetail })}/>
      <div className={styles.tips}>{tips}</div>
    </div>
  );
};

export default NoMsg;
