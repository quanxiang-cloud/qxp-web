import React from 'react';
import { observer } from 'mobx-react';

import store from '../store';
import ModalFields from './model-fields';
import ModelDescHeader from './model-desc-header';
import PageLoading from '@c/page-loading';

function ModelFieldDetails(): JSX.Element {
  const { dataModels, setEditModalType, dataModelsLoading } = store;

  if (dataModelsLoading) {
    return <PageLoading />;
  }

  if (!dataModels.length) {
    return (
      <div className='app-no-data mt-96 text-12'>
        <img src='/dist/images/new_tips.svg' />
        暂无数据。点击
        <span
          onClick={() => setEditModalType('create')}
          className='ml-4 text-blue-600 cursor-pointer'
        >
          添加数据模型
        </span>
      </div>
    );
  }

  return (
    <div className="p-16 flex-1 flex flex-col overflow-auto">
      <ModelDescHeader />
      <ModalFields />
    </div>
  );
}

export default observer(ModelFieldDetails);
