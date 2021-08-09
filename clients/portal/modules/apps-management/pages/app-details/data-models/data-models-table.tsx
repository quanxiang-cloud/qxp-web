import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { UnionColumns } from 'react-table';

import Table from '@c/table';
import Pagination from '@c/pagination';
import Button from '@c/button';
import PopConfirm from '@c/pop-confirm';

import EditorDataModelDrawer from './editor-data-model-drawer';
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
      accessor: 'tableID',
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
      accessor: ({ source }) => source === 1 ? '手动创建' : '表单创建',
    },
    {
      Header: '创建人',
      id: 'creatorName',
      accessor: 'creatorName',
    },
    {
      Header: '创建时间',
      id: 'createdAt',
      accessor: ({ createdAt }) => moment(createdAt, 'X').format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      Header: '操作',
      id: 'action',
      accessor: (rowData) => {
        return (
          <div className='flex gap-6'>
            <span className='text-btn'>查看</span>
            {rowData.source === 1 && (
              <>
                <span
                  onClick={() => store.dataModelModalControl(true, rowData.tableID)}
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
    <div>
      <Button
        onClick={() => store.dataModelModalControl(true)}
        className='mb-16'
        modifier='primary'
      >
        新建
      </Button>
      <Table
        emptyTips='暂无数据模型'
        loading={store.dataModelsLoading}
        rowKey='id'
        columns={COLUMNS}
        data={store.dataModels}
      />
      <Pagination
        current={store.params.page}
        total={store.dataModelTotal}
        pageSize={store.params.size}
        onChange={(page: number, size: number) => store.setParams({ page, size })}
      />
      <EditorDataModelDrawer
        visible={store.editorDataModalVisible}
        isEditor={!!store.curDataModel}
        onSubmit={async (value) => {
          await store.saveDataModel(value);
          store.dataModelModalControl(false);
        }}
        onCancel={() => store.dataModelModalControl(false)}
      />
    </div>
  );
}

export default observer(DataModelsTable);
