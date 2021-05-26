import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import Loading from '@c/loading';

import store from './store';

interface Props {
  className?: string;
}

function DatasetContent(props: Props) {
  useEffect(() => {
    if (store.activeId) {
      store.fetchDataset(store.activeId);
    }
  }, [store.activeId]);

  return (
    <div className="dataset-content flex flex-1 ml-20">
      {store.loadingDataset ? <Loading /> : (
        <>
          <div>{JSON.stringify(toJS(store.activeDataset))}</div>
        </>
      )}
    </div>
  );
}

export default observer(DatasetContent);
