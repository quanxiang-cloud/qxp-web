import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import Table from '@c/lego-table';
import EmptyData from '@c/empty-tips';
import Pagination from '@c/pagination';
// todo remove this
import { adminSearchUserList } from '@portal/pages/access-control/role-management/api';
import Loading from '@c/loading';

import OwnerStore from '../store';

interface IEmployeeTable {
  className?: string;
  userName?: string;
  depID: string | null;
  ownerStore: OwnerStore;
}

export default observer(function EmployeeTable({
  className,
  depID,
  userName,
  ownerStore,
}: IEmployeeTable) {
  const store = ownerStore.employeeStore;
  const { pageNumber: current, pageSize, total } = store.pagination;

  const { data, isLoading } = useQuery(
    [
      'adminSearchUserList',
      { depID, userName, page: current, limit: pageSize },
    ],
    adminSearchUserList,
    {
      refetchOnWindowFocus: false,
      enabled: !!depID,
    },
  );

  useEffect(() => {
    store.setCurrentPage(1);
    store.setSelectedKeys([]);
    store.setTotal(0);
  }, [depID]);
  useEffect(() => {
    if (data?.total) {
      store.setTotal(data.total);
    }
    if (data?.users) {
      store.initialSelectedKeys(data.users, ownerStore.owners);
    }
  }, [data, ownerStore.owners]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  const onUpdateSelectedKeys = (keys: string[]) => {
    if (keys.length > store.selectedKeys.length) {
      keys.filter((key) => !store.selectedKeys.includes(key)).forEach((k) => {
        if (!data?.users) {
          return;
        }
        const user = data.users.find((user) => user.id === k);
        if (!user) {
          return;
        }
        ownerStore.addOwner({
          type: 1,
          ownerID: user.id,
          ownerName: user.userName,
          phone: user.phone,
          email: user.email,
          departmentName: user.dep.departmentName,
          createdAt: user.createTime,
          id: user.id,
          departmentID: user.dep.id,
        });
      });
    } else if (keys.length < store.selectedKeys.length) {
      store.selectedKeys.filter((key) => !keys.includes(key)).forEach((k) => {
        ownerStore.removeOwner(k);
      });
    }
    store.setSelectedKeys(keys);
  };

  function renderTotalTip() {
    return (
      <div className="text-12 text-gray-600">
        共<span className="mx-4">{total || 0}</span>条数据
      </div>
    );
  }

  return (
    <div className={className}>
      <Table
        className="rounded-bl-none rounded-br-none"
        onRow={(record: EmployeeOrDepartmentOfRole) => {
          return {
            onClick: () => {
              const newKeys = store.selectedKeys.includes(record.id) ?
                store.selectedKeys.filter((k) => k !== record.id) :
                [...store.selectedKeys, record.id];
              onUpdateSelectedKeys(newKeys);
            },
          };
        }}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
        rowKey="id"
        dataSource={data?.users || []}
        columns={[
          {
            title: '员工姓名',
            dataIndex: 'userName',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '部门',
            dataIndex: 'dep.departmentName',
          },
        ]}
        rowSelection={{
          selectedRowKeys: store.selectedKeys,
          onChange: onUpdateSelectedKeys,
        }}
      />
      <div className="h-52 bg-white">
        <Pagination
          {...store.pagination}
          renderTotalTip={renderTotalTip}
          showLessItems
          onChange={store.setPagination}
          className="pagination-border"
        />
      </div>
    </div>
  );
});
