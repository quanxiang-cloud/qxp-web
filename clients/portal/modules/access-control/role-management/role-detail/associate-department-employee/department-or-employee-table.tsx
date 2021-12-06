import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { UnionColumns } from 'react-table';

import EmptyData from '@c/empty-tips';
import Pagination from '@c/pagination';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import Table from '@c/table';
import Avatar from '@c/avatar';
import toast from '@lib/toast';
import CheckedUserModal from '@portal/modules/access-control/departments-employees/modal/direct-leader-modal';

import { getRoleAssociations, transferRoleSuper } from '../../api';

export const PAGINATION = {
  total: 0,
  current: 1,
  pageSize: 10,
};

export const ROLE_BIND_TYPE = {
  department: 1,
  employee: 2,
};

interface Props {
  isSuper: boolean;
  onCancelAssociation: (records: EmployeeOrDepartmentOfRole[]) => void;
  roleID: string;
  type: RoleBindType;
}

export default function DepartmentTable(
  { isSuper, onCancelAssociation, roleID, type }: Props,
): JSX.Element {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [, setMemberIDMap] = useState<
    Map<string, EmployeeOrDepartmentOfRole>
  >();
  const [members, setMembers] = useState<EmployeeOrDepartmentOfRole[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  useEffect(() => {
    const map = new Map<string, EmployeeOrDepartmentOfRole>();
    members.forEach((member) => map.set(member.ownerID, member));
    setMemberIDMap(map);
  }, [members.length]);
  const queryClient = useQueryClient();

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
      if (type === ROLE_BIND_TYPE.department) {
        setMembers(data?.employees);
      } else if (type === ROLE_BIND_TYPE.employee) {
        setMembers(data?.departments);
      }
    }
  }, [data]);

  function handleSelectChange(selectedRowKeys: string[]): void {
    setSelectedKeys(selectedRowKeys);
  }

  function onCancel(record: EmployeeOrDepartmentOfRole) {
    return function(): void {
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

  function renderTotalTip(): JSX.Element {
    return (
      <div className="text-12 text-gray-600">
        已选<span className="ml-4">{selectedKeys.length}</span>，
        共<span className="mx-4">{pagination.total || 0}</span>条数据
      </div>
    );
  }

  async function handleChangeSuperManage(user: { id: string, userName: string }): Promise<any> {
    transferRoleSuper(user.id).then(() => {
      toast.success('操作成功！');
      queryClient.invalidateQueries('GET_ROLE_ASSOCIATIONS');
    }).catch((error) => {
      toast.error(error);
    }).finally(() => {
      setShowUserModal(false);
    });
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="something wrong!" />;
  }
  const columns: UnionColumns<EmployeeOrDepartmentOfRole>[] = [
    {
      Header: '操作',
      id: 'action',
      fixed: true,
      width: 40,
      accessor: (record: EmployeeOrDepartmentOfRole) => {
        const isHavePermission = window.USER.id === record.ownerID;
        if (isSuper) {
          return (
            <>
              {type === ROLE_BIND_TYPE.department && members.length && isHavePermission ? (
                <span className='cursor-pointer text-red-600' onClick={() => setShowUserModal(true)}>转让</span>
              ) : <div>-</div>}
            </>
          );
        }
        return (
          <>
            {window.ADMIN_USER_FUNC_TAGS.includes('accessControl/role/manage') ? (
              <span className='cursor-pointer text-red-600' onClick={onCancel(record)}>移除</span>
            ) : <div>-</div>}
          </>
        );
      },
    },
  ];
  if (type === ROLE_BIND_TYPE.department) {
    columns.unshift(...[
      {
        Header: '名称',
        id: 'ownerName',
        fixed: true,
        width: 120,
        accessor: (record: EmployeeOrDepartmentOfRole) => (
          <div className='flex items-center'>
            <Avatar username={record.ownerName} size={24}/>
            <span className='ml-4'>{record.ownerName}</span>
          </div>
        ),
      },
      {
        Header: '手机号',
        id: 'phone',
        accessor: (record: EmployeeOrDepartmentOfRole) => record.phone,
      },
      {
        Header: '邮箱',
        id: 'email',
        accessor: (record: EmployeeOrDepartmentOfRole) => record.email,
      },
      {
        Header: '部门',
        id: 'departmentName',
        accessor: (record: EmployeeOrDepartmentOfRole) => record.departmentName,
      },
    ]);
  }
  if (type === ROLE_BIND_TYPE.employee) {
    columns.unshift({
      Header: '名称',
      id: 'departmentName',
      accessor: 'departmentName',
    });
  }

  return (
    <>
      <div className="flex overflow-hidden" style={{ maxHeight: 'calc(100% - 85px)' }}>
        <Table
          showCheckbox={!isSuper}
          className='rounded-bl-none rounded-br-none text-12 h-full'
          data={members || []}
          onSelectChange={handleSelectChange}
          columns={columns}
          emptyTips={(
            <EmptyData text={type === ROLE_BIND_TYPE.department ? '无成员数据' : '无部门数据'} className="py-10" />
          )}
          rowKey="id"
          initialSelectedRowKeys={selectedKeys || []}
          loading={isLoading}
        />
      </div>
      {!isSuper && (
        <Pagination
          {...pagination}
          renderTotalTip={renderTotalTip}
          onChange={(pageNumber: number, pageSize: number): void => {
            setPagination({ current: pageNumber, pageSize, total: pagination.total });
          }}
        />
      )}
      {showUserModal && (
        <CheckedUserModal
          title="选择转让人"
          submitText="确定转让"
          actionStatus="transfer"
          onSubmit={handleChangeSuperManage}
          onCancel={() => setShowUserModal(false)}
          current={{
            id: '',
            userName: '',
          }}
        />
      )}
    </>
  );
}
