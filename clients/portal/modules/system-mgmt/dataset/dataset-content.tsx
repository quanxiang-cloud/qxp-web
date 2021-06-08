import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Loading from '@c/loading';
import toast from '@lib/toast';

import ListContent from './list-content';
import TreeContent from '@c/editable-tree';

import store from './store';
import { updateDataset } from './api';

interface Props {
  className?: string;
}

function DatasetContent(props: Props) {
  useEffect(() => {
    if (store.activeId) {
      store.fetchDataset(store.activeId);
    }
  }, [store.activeId]);

  const handleSaveTree = (tree: DatasetTreeItem[]) => {
    const serializeCont = JSON.stringify(tree);
    if (serializeCont === JSON.stringify({ ...store.dataList })) {
      toast.error('数据未更改');
      return;
    }

    // @ts-ignore
    updateDataset({
      ...store.activeDataset,
      content: serializeCont,
    }).then((data) => {
      if (data) {
        toast.success('更新成功');
        // @ts-ignore
        // update current content
        store.activeDataset.content = serializeCont;
      } else {
        toast.error('更新失败');
      }
    }).catch((err: Error) => toast.error(err.message));
  };

  const renderContent = () => {
    if (store.activeDataset?.type === 1) {
      return <ListContent />;
    }

    if (store.activeDataset?.type === 2) {
      return <TreeContent initialValue={store.dataList} onSave={handleSaveTree} />;
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
