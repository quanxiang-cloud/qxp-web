import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import EmptyData from '@c/empty-tips';
import Pagination from '@c/pagination';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import Table from '@c/table';
import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';
import toast from '@lib/toast';
import CheckedUserModal from '@portal/modules/access-control/departments-employees/modal/direct-leader-modal';

import { getRoleAssociations, transferRoleSuper } from '../../api';

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
      if (type === RoleBindType.department) {
        setMembers(data?.employees);
      } else if (type === RoleBindType.employee) {
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

  const columns: any[] = [];
  if (type === RoleBindType.department) {
    columns.push(...[
      {
        Header: '名称',
        id: 'ownerName',
        accessor: 'ownerName',
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
        accessor: 'departmentName',
      },
    ]);
  }
  if (type === RoleBindType.employee) {
    columns.push({
      Header: '名称',
      id: 'departmentName',
      accessor: 'departmentName',
    });
  }

  if (type === RoleBindType.department && isSuper && members.length) {
    columns.push({
      Header: '操作',
      id: 'action',
      accessor: (record: EmployeeOrDepartmentOfRole) => {
        const isHavePermission = window.USER.id === record.ownerID;
        return (isHavePermission ? (
          <MoreMenu
            menus={[
              {
                key: 'edit',
                label: (
                  <div className="flex items-center">
                    <Icon name="create" size={16} className="mr-8" />
                    <span className="font-normal">转让管理员</span>
                  </div>
                ),
              },
            ]}
            placement="bottom-end"
            className="opacity-1"
            onMenuClick={(key): void => {
              if (key === 'edit') {
                setShowUserModal(true);
              }
            }}
          />
        ) : <span>-</span>);
      },
    });
  }

  if (!isSuper && window.ADMIN_USER_FUNC_TAGS.includes('accessControl/role/manage')) {
    columns.push({
      Header: '',
      id: 'ownerID',
      accessor: (record: EmployeeOrDepartmentOfRole) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <MoreMenu
              iconName="more_horiz"
              className="rotate-90"
              onMenuClick={onCancel(record)}
              menus={[{
                label: <span><Icon name="link_off" className="ml-6" />取消关联</span>,
                key: 'cancelAssociate',
              }]}
            />
          </div>
        );
      },
    });
  }

  return (
    <>
      <Table
        showCheckbox
        className="text-12 h-full"
        data={members || []}
        onSelectChange={handleSelectChange}
        columns={columns}
        emptyTips={(
          <EmptyData text={type === RoleBindType.department ? '无成员数据' : '无部门数据'} className="py-10" />
        )}
        rowKey="id"
        initialSelectedRowKeys={selectedKeys || []}
        loading={isLoading}
      />
      {!isSuper && (
        <div className="h-52 bg-white">
          <Pagination
            {...pagination}
            renderTotalTip={renderTotalTip}
            className="rounded-bl-12 rounded-br-12 border-t border-gray-200"
            onChange={(pageNumber: number, pageSize: number): void => {
              setPagination({ current: pageNumber, pageSize, total: pagination.total });
            }}
          />
        </div>
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
        />)}
    </>
  );
}
