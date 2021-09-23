import React, { useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';

import Icon from '@c/icon';
import Table from '@c/table';
import Button from '@c/button';
import Search from '@c/search';
import EmptyTips from '@c/empty-tips';

import store from '../store';
import { FIELD_COLUMNS } from '../../utils';
import EditorFieldModals from './editor-field-modals';

function ModelFields(): JSX.Element {
  const [fieldModalType, setFieldModalType] = useState('');
  const [curModelField, setCurModelField] = useState<ModelField | undefined>(undefined);
  const { curDataModel, fields, setSearchModelFieldInput } = store;
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
          return '——';
        }

        return (
          <div
            onClick={() => setCurModelField(rowData)}
            className='flex gap-6'
          >
            <span
              className='text-btn'
              onClick={() => setFieldModalType('edit')}
            >
              编辑
            </span>
            <span
              className='text-btn'
              onClick={() => setFieldModalType('delete')}
            >
              删除
            </span>
          </div>
        );
      },
    },
  ];

  function handleSearchNameChange(val: string): void {
    setSearchModelFieldInput(val);
  }

  function onClose(): void {
    if (fieldModalType === 'delete') {
      setCurModelField(undefined);
    }
    setFieldModalType('');
  }

  return (
    <>
      <div className="py-16 flex items-center">
        <Search
          className="model-field-search mr-16"
          placeholder="搜索字段名称/标识..."
          onChange={handleSearchNameChange}
        />
        <Button
          modifier="primary"
          className="flex items-center"
          forbidden={curDataModel?.source === 1}
          onClick={() => {
            setCurModelField(undefined);
            setFieldModalType('create');
          }}
        >
          <Icon type="light" name="link" size={21} />
          <span className="ml-4">添加字段</span>
        </Button>
      </div>
      <div className="flex-1 text-14 flex flex-col overflow-auto">
        <div className="flex-1 overflow-auto model-field-table">
          <Table
            rowKey="id"
            data={fields}
            columns={COLUMNS}
            emptyTips={(
              <EmptyTips
                className="pt-40 m-auto"
                text={(<>
                  暂无数据，开始
                  <span
                    onClick={() => {
                      if (curDataModel?.source === 2) {
                        setCurModelField(undefined);
                        setFieldModalType('create');
                      }
                    }}
                    className="text-blue-600 cursor-pointer ml-4"
                  >
                  添加字段
                  </span>
                </>)}
              />
            )}
            loading={false}
          />
        </div>
        <div className="data-model-count">{`共 ${fields.length || 0} 条数据`}</div>
      </div>
      {!!fieldModalType && (
        <EditorFieldModals
          onClose={onClose}
          type={fieldModalType}
          curModelField={curModelField}
        />
      )}
    </>
  );
}

export default observer(ModelFields);
