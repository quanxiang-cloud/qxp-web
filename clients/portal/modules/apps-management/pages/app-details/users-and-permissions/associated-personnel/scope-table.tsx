import React from 'react';
import { observer } from 'mobx-react';

import Table from '@c/table';
import Avatar from '@c/avatar';

import store from './store';
import { SCOPE } from '../constants';

function ScopeTable(): JSX.Element {
  const columns: any = [{
    Header: '操作',
    id: 'tool',
    accessor: (user: any) =>
      (<span
        className='text-btn'
        onClick={() => store.deletePerGroupUser([user.id])}
      >
        移除
      </span>),
  }];

  if (store.scopeType === SCOPE.STAFF) {
    columns.unshift(...[
      {
        Header: '姓名',
        id: 'name',
        width: 120,
        accessor: (user: any) => (
          <div className='flex items-center'>
            <Avatar username={user.name} size={24} />
            <span className='ml-4'>{user.name}</span>
          </div>
        ),
      },
      {
        Header: '手机号码',
        id: 'phone',
        accessor: 'phone',
      },
      {
        Header: '邮箱',
        id: 'email',
        accessor: 'email',
      },
      {
        Header: '部门',
        id: 'departmentName',
        accessor: (user: any) => user.departments[0].name,
      },
    ]);
  }
  if (store.scopeType === SCOPE.DEP) {
    columns.unshift(
      {
        Header: '部门',
        id: 'ownerName',
        accessor: 'ownerName',
      },
    );
  }

  return (
    <div className='flex overflow-hidden flex-col justify-between'>
      <div className="flex overflow-y-scroll">
        <Table
          onSelectChange={(selectedKeys: string[]) => store.setSelectUser(selectedKeys)}
          showCheckbox
          rowKey="id"
          loading={store.isLoadingScope}
          data={store.scopeType === 1 ? store.UserDetailList : store.scopeDeptList}
          className="rounded-bl-none rounded-br-none text-12"
          columns={columns}
          emptyTips={(
            <div className='flex flex-col justify-center items-center text-12 text-gray-400'>
              <img src='/dist/images/links.svg' alt="no data" className="mb-8" />
              <span className='text-12'>暂无数据，选择
                <span onClick={() => store.setShowPickerModal(true)} className='text-btn'>&nbsp;关联员工与部门</span>
              </span>
            </div>
          )}
        />
      </div>
      <div className="h-52 text-gray-600 text-12 flex items-center ml-16">
        共{store.scopeType === 1 ? store.UserDetailList.length : store.scopeDeptList.length}条数据
      </div>
    </div>
  );
}

export default observer(ScopeTable);
