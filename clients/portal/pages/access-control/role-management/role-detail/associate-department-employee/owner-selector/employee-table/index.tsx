import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import { Table } from '@portal/components/table2';
import { EmptyData } from '@portal/components/empty-data';
import { Pagination } from '@portal/components/pagination2';
import { adminSearchUserList, IOwner } from '@portal/pages/access-control/role-management/api';
import { Loading } from '@portal/components/loading2';
import OwnerStore from '../store';

interface IEmployeeTable {
  className?: string;
  userName?: string;
  depID: string | null;
  ownerStore: OwnerStore;
}

export const EmployeeTable = observer(({
  className,
  depID,
  userName,
  ownerStore,
}: IEmployeeTable) => {
  const store = ownerStore.employeeStore;
  const { current, pageSize, total } = store.pagination;

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
        });
      });
    } else if (keys.length < store.selectedKeys.length) {
      store.selectedKeys.filter((key) => !keys.includes(key)).forEach((k) => {
        ownerStore.removeOwner(k);
      });
    }
    store.setSelectedKeys(keys);
  };

  return (
    <div className={className}>
      <Table
        className="rounded-bl-none rounded-br-none"
        onRow={(record: IOwner) => {
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
      <Pagination
        type="simple"
        {...store.pagination}
        onShowSizeChange={store.setPageSize}
        onChange={store.setCurrentPage}
        prefix={
          <span className="text-12 text-dark-four">
            {`已选 ${store.selectedKeys.length}, 共 ${total}条`}
          </span>
        }
        className="pagination-border"
      />
    </div>
  );
});
