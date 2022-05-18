import React, { useEffect, useState } from 'react';
import { UnionColumn } from 'react-table';
import { observer } from 'mobx-react';

import Avatar from '@c/avatar';
import Button from '@c/button';
import Table from '@c/table';
import EmptyData from '@c/empty-tips';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

import store from './store';
import { addMember, getGroupMembers, MemberParams } from './api';
import toast from '@lib/toast';
import Pagination from '@c/pagination';
import Search from '@c/search';

const PAGINATION = {
  current: 1,
  pageSize: 10,
};

function GroupDetails(): JSX.Element {
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState<Employee[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [allMembers, setAllMembers] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [searchMembers, setSearchMembers] = useState<string>();

  useEffect(() => {
    if (store.curGroupId) {
      updateGroupMembers({ userName: searchMembers, page: 1, limit: pagination.pageSize });
    }
  }, [store.curGroupId, searchMembers]);

  useEffect(() => {
    if (store.curGroupId && total !== 0) {
      getGroupMembers({
        groupID: store.curGroupId,
        userName: searchMembers,
        page: pagination.current,
        limit: pagination.pageSize,
      }).then(({ users }) => {
        setData(users);
      }).catch((err) => toast.error(err));
    }
  }, [pagination]);

  function updateGroupMembers({ userName, page, limit }: MemberParams): void {
    getGroupMembers({ groupID: store.curGroupId, userName, page, limit }).then(({ users, total }) => {
      setData(users);
      setTotal(total);
    }).catch((err) => toast.error(err));
  }

  function getAllMembers(): void {
    getGroupMembers({ groupID: store.curGroupId, limit: 9999 }).then(({ users }) => {
      setAllMembers(users);
    }).catch((err) => toast.error(err));
  }

  function removeMembers(ids: Array<string>): void {
    addMember({ groupID: store.curGroupId, addUsers: [], delUsers: ids }).then(() => {
      setTimeout(
        () => updateGroupMembers({
          userName: searchMembers, page: pagination.current, limit: pagination.pageSize,
        }),
        1000,
      );
    }).catch((err) => toast.error(err));
  }

  const columns: UnionColumn<Employee>[] = [
    {
      Header: '名称',
      id: 'name',
      fixed: true,
      width: 120,
      accessor: ({ name }: Employee) => (
        <div className='flex items-center'>
          <Avatar username={name.split('')[0]} size={24}/>
          <span className='ml-4'>{name}</span>
        </div>
      ),
    },
    {
      Header: '手机号',
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
      accessor: ({ departments }: Employee) => departments ? departments[0][0].name : '',
    },
    {
      Header: '操作',
      id: 'action',
      fixed: true,
      width: 40,
      accessor: ({ id }: Employee) => {
        return (
          <span className='cursor-pointer text-red-600' onClick={() => removeMembers([id])}>移除</span>
        );
      },
    },
  ];

  if (!store.groupNavMenus.length) {
    return (
      <div className='container flex items-center justify-center h-full font-semibold'>
      暂无成员组, 请创建
      </div>
    );
  }

  function changeMembers(mbmbers: Employee[]): EmployeeOrDepartmentOfRole[] {
    return mbmbers.map((m) => {
      return {
        id: m.id,
        email: '',
        phone: '',
        createdAt: 1,
        departmentID: '',
        departmentName: '',
        ownerID: m.id,
        ownerName: m.name,
        type: 1,
        groupName: '',
      };
    });
  }

  async function onAddMembers(
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[],
  ): Promise<void> {
    const addUsers: Array<string> = [];
    const delUsers: Array<string> = [];
    data.filter((member: { id: string; }) => {
      return !employees.find((m) => m.id === member.id);
    }).forEach((m) => {
      delUsers.push(m.id);
    });
    employees.filter((member) => {
      return !data.find((m: { id: string; }) => m.id === member.id);
    }).forEach((m) => {
      addUsers.push(m.id);
    });
    addMember({ groupID: store.curGroupId, addUsers, delUsers }).then(() => {
      setTimeout(() => updateGroupMembers({ page: pagination.current, limit: pagination.pageSize }), 1000);
      setShowAddModal(false);
    }).catch((err) => toast.error(err));
  }

  function renderTotalTip(): JSX.Element {
    return (
      <div className="text-12 text-gray-600">
        已选<span className="ml-4">{selectedKeys.length}</span>，
        共<span className="mx-4">{total || 0}</span>条数据
      </div>
    );
  }

  return (
    <div className='mx-16 mt-16'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            className='mr-16'
            modifier='primary'
            onClick={() => {
              getAllMembers();
              setSearchMembers('');
              setShowAddModal(true);
            }}
          >
          添加成员
          </Button>
          <Button
            iconName='delete'
            forbidden={!selectedKeys.length}
            onClick={() => removeMembers(selectedKeys)}
          >
          批量移除
          </Button>
        </div>
        <Search
          className='w-220 text-12'
          placeholder='搜索名称...'
          value={searchMembers}
          onChange={setSearchMembers}
        />
      </div>
      <div className='flex overflow-hidden' style={{ maxHeight: 'calc(100% - 85px)' }}>
        <Table
          rowKey='id'
          data={data}
          columns={columns}
          showCheckbox
          className='rounded-bl-none rounded-br-none text-12 h-full'
          onSelectChange={(selectedKeys) => setSelectedKeys(selectedKeys)}
          emptyTips={(
            <EmptyData text='该分组下暂无成员' className='py-10' />
          )}
        />
      </div>
      {!!total && (
        <Pagination
          {...pagination}
          total={total}
          renderTotalTip={renderTotalTip}
          onChange={(pageNumber: number, pageSize: number): void => {
            setPagination({ current: pageNumber, pageSize });
          }}
        />
      )}
      {showAddModal && (
        <EmployeeOrDepartmentPickerModal
          title='添加成员'
          submitText='确定添加'
          onSubmit={onAddMembers}
          onCancel={() => setShowAddModal(false)}
          departments={[]}
          employees={changeMembers(allMembers)}
        />
      )}
    </div>
  );
}

export default observer(GroupDetails);
