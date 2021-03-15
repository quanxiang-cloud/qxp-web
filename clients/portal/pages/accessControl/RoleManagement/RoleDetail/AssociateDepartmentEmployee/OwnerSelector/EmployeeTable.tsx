import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { Table } from '@portal/components/Table';
import { range } from '@assets/lib/f';
import { EmptyData } from '@portal/components/EmptyData';
import { Pagination } from '@portal/components/Pagination';
import { adminSearchUserList } from '@portal/pages/accessControl/RoleManagement/api';
import { Loading } from '@portal/components/Loading';

interface IEmployeeTable {
  className?: string;
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
}: IEmployeeTable) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 30,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery(['adminSearchUserList', { depID }], adminSearchUserList, {
    refetchOnWindowFocus: false,
    cacheTime: -1,
  });

  const getDateSource = () => {
    return range(0, 7).map((i) => ({
      id: `${i}`,
      username: 'Jordan',
      phone: '19960824973',
      email: 'marvin@qq.com',
      departmentName: '质量保证部',
    }));
  };

  const onRowClick = (record: T) => {
    const id = record.id as string;
    setSelectedKeys((arr: string[]) => {
      if (arr.includes(id)) {
        return arr.filter((i) => i !== id);
      } else {
        return [...arr, id];
      }
    });
    setSelectedRows((rows: T[]) => {
      if (rows.find((item) => item.id === id)) {
        return rows.filter((i) => i.id !== id);
      } else {
        return [...rows, record];
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
        dataSource={data?.users || getDateSource()}
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
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
          },
        }}
      />
      <Pagination
        type="simple"
        current={pagination.current}
        total={pagination.total}
        pageSize={pagination.pageSize}
        onShowSizeChange={(pageSize) => setPagination((p) => ({ ...p, pageSize }))}
        onChange={(current) => setPagination((p) => ({ ...p, current }))}
      />
    </div>
  );
};
