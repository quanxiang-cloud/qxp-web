import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import Types from './types';
import ListPanel from './panel-list';
import DetailPanel from './panel-detail';
import msgCenter from '@portal/stores/msg-center';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

const MsgBox = (props: Props) => {
  useEffect(() => {
    return () => {
      msgCenter.reset && msgCenter.reset();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <Types />
      <ListPanel/>
      <DetailPanel/>
    </div>
  );
};

export default observer(MsgBox);
