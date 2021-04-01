import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import EmptyData from '@c/empty-tips';
import More from '@c/more';
import { PAGINATION } from '@const/table';
import Pagination from '@c/pagination';
import { IPagination } from '@t/interface/api';
import { Columns } from '@t/interface/type';
import { getRoleAssociations } from '@net/role-management';
import Loading from '@c/loading';
import Error from '@c/error';
import Table from '@c/table';
import { usePortalGlobalValue } from '@states/portal';

interface Props {
  isSuper: boolean;
  onCancelAssociation: (records: EmployeeOrDepartmentOfRole[]) => void;
  roleID: string | number;
  type: RoleBindType;
}

export default function DepartmentTable({ isSuper, onCancelAssociation, roleID, type }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState<IPagination>(PAGINATION);
  const [{ userInfo }] = usePortalGlobalValue();
  const [_, setMemberIDMap] = useState<
    Map<string, EmployeeOrDepartmentOfRole>
  >();
  const [members, setMembers] = useState<EmployeeOrDepartmentOfRole[]>([]);
  useEffect(() => {
    const map = new Map<string, EmployeeOrDepartmentOfRole>();
    members.forEach((member) => map.set(member.ownerID, member));
    setMemberIDMap(map);
  }, [members.length]);

  const { data, isLoading, isError } = useQuery(
    [
      'GET_ROLE_ASSOCIATIONS',
      {
        type,
        roleID,
        page: pagination.current,
        limit: pagination.pageSize,
      },
    ],
    getRoleAssociations,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
      enabled: !!roleID,
    },
  );

  useEffect(() => {
    if (data?.total) {
      setPagination((p) => ({ ...p, total: data.total }));
      if (type === 1) {
        setMembers(data?.employees);
      } else if (type === 2) {
        setMembers(data?.departments);
      }
    }
  }, [data]);

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: function(selectedRowKeys: string[]) {
      setSelectedKeys(selectedRowKeys);
    },
  };

  function onRowClick(record: DepartmentOfRole) {
    const id = record.ownerID as string;
    setSelectedKeys((arr: string[]) => {
      if (arr.includes(id)) {
        return arr.filter((i) => i !== id);
      } else {
        return [...arr, id];
      }
    });
  }

  function onCancel(record: EmployeeOrDepartmentOfRole) {
    return function() {
      setSelectedKeys((selectedKeys) => {
        setMemberIDMap((memberIDMap) => {
          const records = [];
          if (selectedKeys.length > 0 && memberIDMap) {
            selectedKeys.forEach((ownerID) => {
              const record = memberIDMap.get(ownerID);
              record && records.push(record);
            });
          }
          if (!selectedKeys.includes(record.ownerID)) {
            record && records.push(record);
          }
          onCancelAssociation(records);
          return memberIDMap;
        });
        return selectedKeys;
      });
    };
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <Error desc="something wrong!" />;
  }
  if (!members.length) {
    return null;
  }

  const columns: Columns = [];
  if (type === 1) {
    columns.push(...[
      {
        title: '名称',
        dataIndex: 'ownerName',
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
    ]);
  }
  if (type === 2) {
    columns.push({
      title: '名称',
      dataIndex: 'departmentName',
    });
  }
  if (!isSuper && userInfo.authority.includes('accessControl/role/manage')) {
    columns.push({
      title: '',
      dataIndex: 'ownerID',
      render: (ownerID: string, record: EmployeeOrDepartmentOfRole) => {
        return (
          <More<DepartmentOfRole>
            items={[
              {
                id: ownerID,
                iconName: '/dist/images/linkOff.svg',
                text: '取消关联',
                onclick: onCancel(record),
              },
            ]}
            params={record}
            className="inline-flex items-center justify-center"
            contentClassName="w-48"
            contentItemClassName="justify-center"
          />
        );
      },
    });
  }

  return (
    <>
      <Table
        rowKey="ownerID"
        dataSource={members}
        className="rounded-bl-none rounded-br-none"
        columns={columns}
        rowSelection={rowSelection}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
      {!isSuper && (
        <Pagination
          {...pagination}
          type="simple"
          prefix={
            <span className="text-12 text-gray-400">
              {`共 ${pagination.total} 个${type === 1 ? '员工' : '部门'}`}
            </span>
          }
          onShowSizeChange={(pageSize) => setPagination((p) => ({ ...p, pageSize }))}
          onChange={(current) => setPagination((p) => ({ ...p, current }))}
          className="rounded-bl-12 rounded-br-12 pagination-border"
        />
      )}
    </>
  );
}
