import React from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';
import Table from '@c/table';

import store from './store';
import { FIELD_COLUMNS } from './utils';

function ModelDetails(): JSX.Element {
  if (store.modelDetailsLoading) {
    return <PageLoading />;
  }

  return (
    <div className='p-20'>
      <div className='mb-16'>模型名称：{store.basicInfo.title}</div>
      <div className='mb-16'>模型编码：{store.basicInfo.table_id}</div>
      <div className='mb-16'>模型简介：{store.basicInfo.descpition || '—'}</div>
      <div className='mb-16'>模型字段：</div>
      <Table emptyTips='暂无模型字段' rowKey='id' columns={FIELD_COLUMNS} data={store.fields} />
    </div>
  );
}

export default observer(ModelDetails);
