import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Loading from '@c/loading';

import ListContent from './list-content';
import TreeContent from './tree-content';

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

  const renderContent = () => {
    if (store.activeDataset?.type === 1) {
      return <ListContent />;
    }

    if (store.activeDataset?.type === 2) {
      return <TreeContent />;
    }
  };

  return (
    <div className="dataset-content flex flex-1 flex-col py-20 overflow-auto">
      <div className="dataset-content--title mb-20">
        数据集: {store.activeDataset?.name} (类型: {store.activeDataset?.type === 1 ? '数组' : '层级'})
      </div>
      <div>
        <p>ID: <span className="text-gray-400">{store.activeDataset?.id}</span></p>
        <p>Tag: <span className="text-gray-400">{store.activeDataset?.tag}</span></p>
      </div>
      <div className="dataset-content--datas mt-20 pr-20">
        {store.loadingDataset ? <Loading /> : renderContent()}
      </div>
    </div>
  );
}

export default observer(DatasetContent);
