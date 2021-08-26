import React from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';
import Table from '@c/table';

import store from './store';
import { FIELD_COLUMNS } from '../utils';

function ModelDetails(): JSX.Element {
  if (store.modelDetailsLoading) {
    return <PageLoading />;
  }

  return (
    <div style={{ height: 'calc(100vh - 56px)' }} className='p-20 flex flex-col'>
      <div className='mb-16'>模型名称：{store.basicInfo.title}</div>
      <div className='mb-16'>模型编码：{store.basicInfo.tableID}</div>
      <div className='mb-16'>模型简介：{store.basicInfo.description || '—'}</div>
      <div className='mb-16'>模型字段：</div>
      <div className='flex overflow-hidden'>
        <Table emptyTips='暂无模型字段' rowKey='id' columns={FIELD_COLUMNS} data={store.fields} />
      </div>
    </div>
  );
}

export default observer(ModelDetails);
