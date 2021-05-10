import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import EmptyData from '@c/empty-tips';
import More from '@c/more';
import Pagination from '@c/pagination';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import Table from '@c/lego-table';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';

import { getRoleAssociations } from '../../api';

export const PAGINATION = {
  total: 0,
  current: 1,
  pageSize: 10,
};

interface Props {
  isSuper: boolean;
  onCancelAssociation: (records: EmployeeOrDepartmentOfRole[]) => void;
  roleID: string;
  type: RoleBindType;
}

export default function DepartmentTable({ isSuper, onCancelAssociation, roleID, type }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [{ userInfo }] = usePortalGlobalValue();
  const [, setMemberIDMap] = useState<
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
        roleId: roleID,
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
    if (data) {
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

  function renderTotalTip() {
    return (
      <div className="text-12 text-gray-600">
        已选<span className="ml-4">{selectedKeys.length}</span>，
        共<span className="mx-4">{pagination.total || 0}</span>条数据
      </div>
    );
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="something wrong!" />;
  }

  const columns: EmployeeTableColumn[] = [];
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
        emptyText={(
          <EmptyData text={type === 1 ? '无成员数据' : '无部门数据'} className="py-10" />
        )}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
      {!isSuper && (
        <div className="h-52 bg-white">
          <Pagination
            {...pagination}
            renderTotalTip={renderTotalTip}
            className="rounded-bl-12 rounded-br-12 border-t border-gray-200"
            onChange={(pageNumber, pageSize) => {
              setPagination({ current: pageNumber, pageSize, total: pagination.total });
            }}
          />
        </div>
      )}
    </>
  );
}
