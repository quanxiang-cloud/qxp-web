import React, { useState, useEffect } from 'react';
import { UnionColumn } from 'react-table';

import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import Authorized from '@c/authorized';
import Button from '@c/button';
import MoreMenu from '@c/more-menu';
import ToolTip from '@c/tooltip';
import { getTwoDimenArrayHead } from '@lib/utils';

import EmployeeModal, { ModalType } from './modal';
import { UserStatus } from './type';
import { EmployeesActions } from './constant';
import useSearchEmployees from './hooks/useSearchEmployees';
import useEmployeesColumns from './hooks/useEmployeeColumn';

const initUserInfo = { id: '', name: '', email: '', phone: '', selfEamil: '' };
const initSearch = { page: 1, limit: 10 };

interface Props {
  department: Department;
}

export default function Employees({
  department,
}: Props): JSX.Element {
  const [modalType, setModalType] = useState<ModalType>('');
  const [modifyState, setModifyState] = useState<UserStatus>(UserStatus.normal);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Employee[]>([]);
  const [currUser, setCurrUser] = useState<Employee>(initUserInfo);
  const [pageParams, setPageParams] = useState(initSearch);

  const { EmployeesColumns, filterUserInfo } = useEmployeesColumns();

  const { employeesList, isLoading, refetch } = useSearchEmployees({
    departmentID: department.id,
    ...filterUserInfo,
    page: pageParams.page,
    size: pageParams.limit,
  });

  useEffect(() => {
    setPageParams({
      page: 1,
      limit: 10,
    });
    setSelectedUserIds([]);
  }, [department.id]);

  function handleDepLeader(params: Employee): void {
    setCurrUser(params);
    openModal('leader_handle');
  }

  function showUserInfo(user: Employee): void {
    setCurrUser(user);
    openModal('show_employees');
  }

  function handleUserInfo(user: Employee): void {
    setCurrUser(user);
    openModal('edit_employees');
  }

  function handleResetPWD(user: Employee): void {
    setSelectedUsers([user]);
    openModal('reset_password');
  }

  function handleUserState(status: UserStatus, user: Employee): void {
    setCurrUser(user);
    setModifyState(status);
    openModal('alert_user_state');
  }

  function openExportModal(): void {
    openModal('export_employees');
  }

  function openModal(type: ModalType): void {
    setModalType(type);
  }

  function handleCleanChecked(): void {
    setSelectedUserIds([]);
    setSelectedUsers([]);
  }

  function handlePageChange(current: number, pageSize: number): void {
    setPageParams({ ...pageParams, page: current, limit: pageSize });
  }

  function closeModal(): void {
    if (modalType === 'alert_user_state') {
      handleCleanChecked();
    }
    setModalType('');
  }

  function handleSelectChange(selectedRowKeys: string[], selectedRows: Employee[]): void {
    setSelectedUserIds(selectedRowKeys);
    setSelectedUsers(selectedRows);
  }

  const columns: UnionColumn<Employee>[] = [...EmployeesColumns];

  if (window.ADMIN_USER_FUNC_TAGS.includes('accessControl/mailList/manage')) {
    columns.push({
      Header: '操作',
      id: 'action',
      fixed: true,
      width: 40,
      accessor: (record: Employee) => {
        const dep = getTwoDimenArrayHead(record.departments);
        const isDEPLeader = dep?.attr === '1' ? 1 : -1;
        const menu = EmployeesActions.filter((menu) => {
          return menu.authority.includes(record?.useStatus || 0) &&
            menu.leader.includes(isDEPLeader || 0);
        });
        return (
          <MoreMenu
            menus={menu}
            placement="bottom-end"
            className="opacity-1"
            onMenuClick={(key): void => {
              if (key === 'show-info') {
                showUserInfo(record);
                return;
              }
              if (key === 'edit') {
                handleUserInfo(record);
                return;
              }
              if (key === 'confer' || key === 'revoke') {
                handleDepLeader(record);
              }
              if (key === 'reset') {
                handleResetPWD(record);
                return;
              }
              if (key === 'disable') {
                handleUserState(UserStatus.disable, record);
              }
              if (key === 'enable') {
                handleUserState(UserStatus.normal, record);
              }
              if (key === 'delete') {
                handleUserState(UserStatus.delete, record);
                return;
              }
            }}
          />
        );
      },
    });
  }

  return (
    <>
      <div className="h-full flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center ml-20 mb-20">
          <div className="text-h6">{department.name}</div>
          <div className="text-12 text-gray-400">（{employeesList?.total || 0}人）</div>
        </div>
        <div className="flex items-stretch px-20 justify-between">
          <Authorized authority={['accessControl/mailList/manage']}>
            <div className="flex">
              <Button
                modifier="primary"
                onClick={(): void => openModal('import_export_employees')}
                className="mr-16"
              >
                批量导入/导出
              </Button>
              <Button
                iconName="add"
                onClick={(): void => handleUserInfo(initUserInfo)}
                className="mr-16"
              >
                添加员工
              </Button>
              <ToolTip
                position="top-start"
                label='勾选成员后，才可以转移部门'
                labelClassName="adjust-department-tip"
              >
                <span>
                  <Button
                    modifier="primary"
                    onClick={(): void => openModal('adjust_dep')}
                    className="mr-16"
                    forbidden={!selectedUserIds.length}
                  >
                    变更部门
                  </Button>
                </span>
              </ToolTip>
            </div>
          </Authorized>
        </div>

        <div
          className="qxp-table flex w-full border-b  mt-16 px-20"
          style={{ height: 'calc(100% - 142px)' }}
        >
          <Table
            showCheckbox
            className="text-14 h-full"
            data={employeesList?.users || []}
            onSelectChange={handleSelectChange}
            columns={columns}
            emptyTips={(
              <EmptyTips text="无成员数据" className="py-32" />
            )}
            rowKey="id"
            initialSelectedRowKeys={selectedUserIds || []}
            loading={isLoading}
          />
        </div>
        {
          (employeesList?.users && employeesList?.users.length > 0) && (
            <Pagination
              current={pageParams.page}
              total={employeesList?.total || 0}
              pageSize={pageParams.limit}
              onChange={handlePageChange}
              renderTotalTip={() => (
                <div className="text-12 text-gray-600">
                  共<span className="mx-4">{employeesList?.total || 0}</span>条数据
                </div>
              )}
            />
          )
        }
      </div>
      <EmployeeModal
        modalType={modalType}
        selectedUsers={selectedUsers}
        currUser={currUser}
        modifyState={modifyState}
        department={department}
        closeModal={closeModal}
      />
    </>
  );
}
