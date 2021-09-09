import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { UnionColumns } from 'react-table';

import Table from '@c/table';
import Pagination from '@c/pagination';
import Button from '@c/button';
import Drawer from '@c/drawer';
import PopConfirm from '@c/pop-confirm';

import EditorDataModelDrawer from './editor-data-model-drawer';
import ModelDetails from './model-details';
import store from './store';

function DataModelsTable(): JSX.Element {
  const COLUMNS: UnionColumns<DataModel>[] = [
    {
      Header: '模型名称',
      id: 'title',
      accessor: 'title',
    },
    {
      Header: '模型编码',
      id: 'tableID',
      accessor: ({ tableID }) => tableID.split('_').pop(),
    },
    {
      Header: '字段数',
      id: 'fieldLen',
      accessor: 'fieldLen',
    },
    {
      Header: '模型描述',
      id: 'description',
      accessor: 'description',
    },
    {
      Header: '来源',
      id: 'source',
      accessor: ({ source }) => source === 2 ? '手动创建' : '表单创建',
    },
    {
      Header: '创建人',
      id: 'creatorName',
      accessor: 'creatorName',
    },
    {
      Header: '创建时间',
      id: 'createdAt',
      accessor: ({ createdAt }) => {
        return createdAt ? moment(createdAt, 'X').format('YYYY-MM-DD HH:mm:ss') : '—';
      },
    },
    {
      Header: '操作',
      id: 'action',
      accessor: (rowData) => {
        return (
          <div className='flex gap-6'>
            <span
              onClick={() => store.dataModelModalControl('details', rowData)}
              className='text-btn'
            >
              查看
            </span>
            {rowData.source === 2 && (
              <>
                <span
                  onClick={() => store.dataModelModalControl('edit', rowData)}
                  className='text-btn'
                >
                  编辑
                </span>
                <PopConfirm content='确认删除该数据？' onOk={() => store.delDataModel(rowData.tableID)} >
                  <span className='text-btn'>删除</span>
                </PopConfirm>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Button
        onClick={() => store.dataModelModalControl('edit')}
        className='mb-16'
        modifier='primary'
      >
        新建
      </Button>
      <div className='flex' style={{ maxHeight: 'calc(100% - 100px)' }}>
        <Table
          emptyTips='暂无数据模型'
          loading={store.dataModelsLoading}
          rowKey='id'
          columns={COLUMNS}
          data={store.dataModels}
        />
      </div>
      <Pagination
        current={store.params.page}
        total={store.dataModelTotal}
        pageSize={store.params.size}
        onChange={(page: number, size: number) => store.setParams({ page, size })}
      />
      <EditorDataModelDrawer
        visible={store.modelModalType === 'edit'}
        isEditor={!!store.curDataModel}
        onSubmit={async (value) => {
          await store.saveDataModel(value);
          store.dataModelModalControl('');
        }}
        onCancel={() => store.dataModelModalControl('')}
      />
      <Drawer
        position='right'
        visible={store.modelModalType === 'details'}
        title={store.basicInfo && store.basicInfo.title as string}
        onCancel={() => store.dataModelModalControl('')}
      >
        <ModelDetails />
      </Drawer>
    </>
  );
}

export default observer(DataModelsTable);
