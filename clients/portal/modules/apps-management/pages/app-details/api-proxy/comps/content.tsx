import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Loading from '@c/loading';
import NoData from './no-data';

import store from '../stores';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

function Content(props: Props) {
  if (!store.treeStore) {
    return <Loading />;
  }

  if (!store.activeGroup || store.treeStore.noLeafNodes) {
    return <NoData/>;
  }

  return (
    <div className={cs('w-full h-full overflow-auto api-proxy--main-cont', props.className)}>
      {props.children}
    </div>
  );
}

export default observer(Content);
