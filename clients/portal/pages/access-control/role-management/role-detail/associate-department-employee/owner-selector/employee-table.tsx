import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { Table } from '@portal/components/table';
import { EmptyData } from '@portal/components/empty-data';
import { Pagination } from '@portal/components/pagination';
import { adminSearchUserList, IOwner } from '@portal/pages/access-control/role-management/api';
import { Loading } from '@portal/components/loading';
import { usePrevious } from '@assets/lib/hooks/use-previous-value';
import { IUser } from '@portal/pages/access-control/role-management/api';

interface IEmployeeTable {
  className?: string;
  userName?: string;
  depID: string | null;
  selectedOwner: IOwner[];
  setSelectedOwner: React.Dispatch<React.SetStateAction<IOwner[]>>;
}

export const EmployeeTable = ({
  className,
  depID,
  userName,
  selectedOwner,
  setSelectedOwner,
}: IEmployeeTable) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });
  const previousSelectedKeys = usePrevious<string[]>(selectedKeys);

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
    if (data?.users) {
      const filteredOwner = selectedOwner.filter((owner) =>
        data?.users?.find((user) => user.id === owner.ownerID),
      );
      setSelectedKeys(filteredOwner.map((item) => item.ownerID));
    }
  }, [data]);

  useEffect(() => {
    setSelectedKeys((selectedKeys) =>
      selectedKeys.filter((key) => !!selectedOwner.find((owner) => owner.ownerID === key)),
    );
  }, [selectedOwner]);

  useEffect(() => {
    const adds: IUser[] = [];
    const remove: IUser[] = [];
    previousSelectedKeys?.forEach((key) => {
      if (!selectedKeys.includes(key)) {
        const user = data?.users?.find(({ id }) => id === key);
        if (user) {
          remove.push(user);
        }
      }
    });
    selectedKeys.forEach((key) => {
      if (!previousSelectedKeys?.includes(key)) {
        const user = data?.users?.find(({ id }) => id === key);
        if (user) {
          adds.push(user);
        }
      }
    });
    remove.forEach((user) => {
      setSelectedOwner(
        (owners) => owners.filter((owner) => owner?.ownerID !== user.id) as IOwner[],
      );
    });
    adds.forEach((user) => {
      setSelectedOwner((owners) => {
        const newOwner = {
          type: 1,
          ownerID: user.id,
          ownerName: user.userName,
          phone: user.phone,
          email: user.email,
          departmentName: user.dep?.departmentName,
          createdAt: user.createTime,
          id: '',
        };
        if (!owners.find((owner) => owner.ownerID === user.id)) {
          return [...owners, newOwner];
        }
        return owners;
      });
    });
  }, [selectedKeys]);

  const onRowClick = (record: IOwner) => {
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
        onRow={(record: IOwner) => {
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
