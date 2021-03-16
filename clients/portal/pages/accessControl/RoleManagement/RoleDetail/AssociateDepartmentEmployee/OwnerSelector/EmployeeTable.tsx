import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { Table } from '@portal/components/Table';
import { EmptyData } from '@portal/components/EmptyData';
import { Pagination } from '@portal/components/Pagination';
import { adminSearchUserList } from '@portal/pages/accessControl/RoleManagement/api';
import { Loading } from '@portal/components/Loading';

interface IEmployeeTable {
  className?: string;
  userName?: string;
  depID: string | null;
}

export const EmployeeTable = <
  T extends {
    id: string;
    username: string;
    phone: string;
    email: string;
    departmentName: string;
  }
>({
  className,
  depID,
  userName,
}: IEmployeeTable) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery(
    [
      'adminSearchUserList',
      { depID, userName, page: pagination.current, limit: pagination.pageSize },
    ],
    adminSearchUserList,
    {
      refetchOnWindowFocus: false,
      enabled: !!depID,
    },
  );

  useEffect(() => {
    if (data?.total) {
      setPagination((p) => ({ ...p, total: data?.total as number }));
    }
  }, [data]);

  const onRowClick = (record: T) => {
    const id = record.id as string;
    setSelectedKeys((arr: string[]) => {
      if (arr.includes(id)) {
        return arr.filter((i) => i !== id);
      } else {
        return [...arr, id];
      }
    });
  };

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div style={{ height: 'calc(100% - 48px)' }} className={className}>
      <Table
        className="rounded-bl-none rounded-br-none"
        onRow={(record: T) => {
          return {
            onClick: () => onRowClick(record),
          };
        }}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
        rowKey="id"
        dataSource={data?.users || []}
        columns={[
          {
            title: '员工姓名',
            dataIndex: 'username',
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
            dataIndex: 'departmentName',
          },
        ]}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (selectedRowKeys) => setSelectedKeys(selectedRowKeys),
        }}
      />
      <Pagination
        type="simple"
        current={pagination.current}
        total={pagination.total}
        pageSize={pagination.pageSize}
        onShowSizeChange={(pageSize) => setPagination((p) => ({ ...p, pageSize }))}
        onChange={(current) => setPagination((p) => ({ ...p, current }))}
        prefix={
          <span className="text-dot-6 text-dark-four">
            {`已选 ${selectedKeys.length}, 共 ${pagination.total}条`}
          </span>
        }
      />
    </div>
  );
};
