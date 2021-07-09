import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Table from '@c/table';
import Pagination from '@c/pagination';
import EmptyTips from '@c/empty-tips';
// todo remove this
import { adminSearchUserList } from '@portal/modules/access-control/role-management/api';
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
  const { current, pageSize, total } = store.pagination;
  const [isLoading, setIsLoading] = React.useState(true);

  const { data } = useQuery(
    [
      'adminSearchUserList',
      { depID, userName, page: current, limit: pageSize },
    ],
    (params) => {
      return adminSearchUserList({ queryKey: params.queryKey }).then((res) => {
        setIsLoading(false);
        return res;
      });
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!depID,
    },
  );

  useEffect(() => {
    store.setCurrentPage(1);
    store.setSelectedKeys([]);
    store.setTotal(0);
  }, [depID, userName]);
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
        已选<span className="ml-4">{store.selectedKeys.length}</span>，
        共<span className="mx-4">{total || 0}</span>条数据
      </div>
    );
  }

  return (
    <div
      className={cs('h-full bg-white', className)}
    >
      <div
        className="flex w-full border-b"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <Table
          // className="rounded-bl-none rounded-br-none h-full"
          showCheckbox
          rowKey="id"
          data={data?.users || []}
          emptyTips={<EmptyTips text="无成员数据" className="py-10" />}
          columns={[
            {
              Header: '员工姓名',
              id: 'userName',
              fixed: true,
              accessor: 'userName',
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
              id: 'dep.departmentName',
              accessor: ({ dep }: Employee) => {
                return dep?.departmentName;
              },
            },
          ]}
          initialSelectedRowKeys={store.selectedKeys || []}
          onSelectChange={onUpdateSelectedKeys}
        />
      </div>
      <div className="h-52 bg-white">
        <Pagination
          {...store.pagination}
          renderTotalTip={renderTotalTip}
          showLessItems
          onChange={store.setPagination}
          className="border-t border-gray-200"
        />
      </div>
    </div>
  );
});
