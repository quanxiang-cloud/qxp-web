import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';

import Icon from '@c/icon';
import Table from '@c/table';
import Button from '@c/button';
import Search from '@c/search';
import EmptyTips from '@c/empty-tips';
import { deepClone } from '@lib/utils';
import PageLoading from '@c/page-loading';

import store from '../store';
import { FIELD_COLUMNS } from '../../utils';

function ModelFields(): JSX.Element {
  const {
    fields,
    curDataModel,
    setCurModelField,
    setEditFieldType,
    dataModelsLoading,
    setSearchModelFieldInput,
  } = store;
  const COLUMNS: UnionColumns<ModelField>[] = [
    ...FIELD_COLUMNS,
    {
      Header: '是否作为外键',
      id: 'isForeignKeys',
      accessor: (rowData) => {
        return (
          <span
            className={cs('foreign-key-col', {
              'text-blue-600 bg-blue-100': rowData.isForeignKeys,
            })}
          >
            {rowData.isForeignKeys ? '是' : '否'}
          </span>
        );
      },
    },
    {
      Header: '操作',
      id: 'action',
      accessor: (rowData) => {
        if (rowData?.['x-internal']?.isSystem || curDataModel?.source !== 2) {
          return '-';
        }

        return (
          <div className='flex gap-6' onClick={() => setCurModelField(rowData)}>
            <span className='text-btn' onClick={() => setEditFieldType('edit')}>编辑</span>
            <span className='text-btn' onClick={() => setEditFieldType('delete')}>删除</span>
          </div>
        );
      },
    },
  ];

  function handleSearchNameChange(val: string): void {
    setSearchModelFieldInput(val);
  }

  return (
    <>
      <div className="pt-16 pb-8 flex items-center justify-between">
        <Button
          modifier="primary"
          className="flex items-center w-100"
          forbidden={curDataModel?.source === 1}
          onClick={() => {
            setCurModelField(null);
            setEditFieldType('create');
          }}
        >
          <Icon type="light" name="add" className="flex-shrink-0" size={16} />
          <span className="ml-4 text-12">添加字段</span>
        </Button>
        <Search
          className="model-field-search"
          placeholder="搜索字段名称/标识..."
          onChange={handleSearchNameChange}
        />
      </div>
      <div className="flex-1 text-14 flex flex-col overflow-auto">
        <div className="flex-1 overflow-auto model-field-table relative">
          {store.modelDetailsLoading ? <PageLoading /> : (
            <Table
              rowKey="id"
              data={fields}
              columns={curDataModel?.source === 1 ? deepClone(COLUMNS.slice(0, COLUMNS.length - 1)) : COLUMNS}
              loading={dataModelsLoading}
              emptyTips={(
                <EmptyTips
                  className="pt-40 m-auto"
                  text={(
                    <>
                      暂无数据，开始
                      <span
                        onClick={() => {
                          if (curDataModel?.source === 2) {
                            setCurModelField(null);
                            setEditFieldType('create');
                          }
                        }}
                        className="text-blue-600 cursor-pointer ml-4"
                      >
                        添加字段
                      </span>
                    </>
                  )}
                />
              )}
            />
          )}
        </div>
        <div className="data-model-count">{`共 ${fields.length || 0} 条数据`}</div>
      </div>
    </>
  );
}

export default observer(ModelFields);
