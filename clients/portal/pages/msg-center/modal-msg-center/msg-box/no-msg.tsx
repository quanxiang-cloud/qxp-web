import React from 'react';
import cs from 'classnames';

import styles from './index.module.scss';

interface Props {
  tips?: string;
  className?: string;
  noDetail?: boolean;
}

const NoMsg = ({ tips, className, noDetail }: Props) => {
  return (
    <div className={cs(styles.noMsg, className)}>
      <div className={cs(styles.picNoMsg, { [styles.picNoDetail]: noDetail })}/>
      <div className={styles.tips}>{tips}</div>
    </div>
  );
};

export default NoMsg;
