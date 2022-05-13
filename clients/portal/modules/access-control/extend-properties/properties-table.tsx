import React from 'react';
import { UnionColumn } from 'react-table';
import { observer } from 'mobx-react';

import Table from '@c/table';
import Toggle from '@c/toggle';
import toast from '@lib/toast';
import Select from '@c/select';
import Icon from '@c/icon';
import EmptyTips from '@c/empty-tips';

import { setColumn } from './api';
import store, { FIELD_TYPE } from './store';
import { typeOptions } from './properties-form';
import { FromTypes, TableParams } from './type';

const filterTypeOptions: Array<{ label: string, value: 'all' | FromTypes}> =
  [{ label: '全部', value: 'all' }, ...typeOptions];

function PropertiesTable(): JSX.Element {
  const columns: UnionColumn<TableParams>[] = [
    {
      Header: '名称',
      id: 'name',
      width: 'auto',
      accessor: 'name',
    },
    {
      Header: (
        <Select
          defaultValue='all'
          options={filterTypeOptions}
          onChange={(val) => {
            store.setFilterType(val);
            store.getFilterData(val);
          }}
        >
          <div
            className='flex content-center items-center pointer'
          >
            <div>字段类型</div>
            <Icon name="filter_alt" className='ml-8'/>
          </div>
        </Select>
      ),
      id: 'types',
      width: 'auto',
      accessor: ({ types }: TableParams) => {
        return (
          <span>{FIELD_TYPE[types].label}</span>
        );
      },
    },
    {
      Header: '可用状态',
      id: 'status',
      width: 'auto',
      accessor: ({ id, status }: TableParams) => {
        return (
          <div className='flex gap-6'>
            <div
              onClick={() => {
                if (status) {
                  // todo
                }
              }}
            >
              <Toggle
                onText="开启"
                offText="关闭"
                className='text-12'
                checked={status === 1 ? true : false}
                onChange={(checked) => {
                  changeStatus(checked, id).then(() => {
                    store.fetchCloum(0);
                    toast.success('修改可用状态成功');
                  }).catch((err) => toast.error(err));
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      Header: '可见状态',
      id: 'viewerStatus',
      width: 'auto',
      accessor: ({ id, viewerStatus }: TableParams) => {
        return (
          <div className='flex gap-6'>
            <div
              onClick={() => {
                if (viewerStatus) {
                  // todo
                }
              }}
            >
              <Toggle
                onText="开启"
                offText="关闭"
                className='text-12'
                checked={viewerStatus === 1 ? true : false}
                onChange={(checked) => {
                  setColumn([{ columnID: id, viewerStatus: checked ? 1 : -1 }], []).then(() => {
                    store.fetchCloum(0);
                    toast.success('修改可见状态成功');
                  }).catch((err) => toast.error(err));
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      Header: '操作',
      id: 'action',
      width: 130,
      accessor: (colDetail: TableParams) => {
        return (
          <div className='flex'>
            <span
              className='text-btn mr-16'
              onClick={() => store.handleEdit(colDetail)}
            >
              修改
            </span>
            {/* <span
              className='delete-text-btn'
              onClick={() =>{
                store.handleDel(colDetail.id || '');
              }}
            >
              删除
            </span> */}
          </div>
        );
      },
    },
  ];

  function changeStatus(
    checked: boolean,
    id: string,
  ): Promise<void> {
    if (checked) {
      return setColumn([{ columnID: id, viewerStatus: -1 }], []);
    }

    return setColumn([], [id]);
  }

  return (
    <div className='flex mt-8 overflow-auto' style={{ height: 'calc(100vh - 185px)' }}>
      <Table
        rowKey='id'
        loading={store.loading}
        columns={columns}
        data={store.tableData}
        emptyTips={<EmptyTips text='暂无扩展属性' className="pt-40" />}
      />
    </div>
  );
}

export default observer(PropertiesTable);
