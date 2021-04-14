import React from 'react';
import Types from './types';
import ListPanel from './panel-list';
import DetailPanel from './panel-detail';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

const MsgBox = (props: Props) => {
  return (
    <div className={styles.wrap}>
      <Types />
      <ListPanel/>
      <DetailPanel/>
    </div>
  );
};

export default MsgBox;
