import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import Authorized from '@c/authorized';
import Button from '@c/button';
import IconButton from '@c/icon-btn';
import MoreMenu from '@c/more-menu';
import CheckBox from '@c/checkbox';
import toast from '@lib/toast';

import { getUserAdminInfo } from './api';
import EditEmployeesModal from './modal/edit-employees-modal';
import ImportEmployeesModal from './modal/import-employees-modal';
import ResetPasswordModal from './modal/reset-password-modal';
import AlterUserStateModal from './modal/alert-user-state-modal';
import AdjustDepModal from './modal/adjust-dep-modal';
import LeaderHandleModal from './modal/leader-handle-modal';
import ExportEmployees from './export-employees';

import { exportEmployees } from './utils';
import { UserStatus } from './type';
import { EmployeesColumns, EmployeesActions, ExpandActions } from './constant';

type ModalType = '' | 'edit_employees' | 'import_employees' | 'reset_password' |
  'alert_user_state' | 'adjust_dep' | 'leader_handle' | 'export_employees';

const initUserInfo = { id: '', userName: '', email: '', phone: '' };
const initSearch = { page: 1, limit: 10, userName: '', includeChildDEPChild: 0 };

interface Props {
  department: Department;
  searchWord: string;
}

export default function Employees({
  department,
  searchWord,
}: Props): JSX.Element {
  const [modalType, setModalType] = useState<ModalType>('');
  const [check, setCheck] = useState(0);
  const [userState, setUserState] = useState<UserStatus>(UserStatus.normal);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Employee[]>([]);
  const [currUser, setCurrUser] = useState<Employee>(initUserInfo);
  const [pageParams, setPageParams] = React.useState(initSearch);

  const { data: employeesList, isLoading, refetch } = useQuery(
    ['GET_USER_ADMIN_INFO', pageParams, department.id],
    () => getUserAdminInfo(department.id, pageParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    setPageParams({ ...pageParams, userName: searchWord, includeChildDEPChild: check });
  }, [searchWord, check]);

  useEffect(() => {
    setPageParams({ page: 1, limit: 10, userName: '', includeChildDEPChild: check });
    setSelectedUserIds([]);
  }, [department.id]);

  function handleDepLeader(params: Employee): void {
    setCurrUser(params);
    openModal('leader_handle');
  }

  function handleUserInfo(user: Employee): void {
    setCurrUser(user);
    openModal('edit_employees');
  }

  function handleResetPWD(user: Employee): void {
    setSelectedUsers([user]);
    openModal('reset_password');
  }

  function handleCleanChecked(): void {
    setSelectedUserIds([]);
    setSelectedUsers([]);
  }

  function renderTotalTip(): JSX.Element {
    return (
      <div className="text-12 text-gray-600">
        共<span className="mx-4">{employeesList?.total || 0}</span>条数据
      </div>
    );
  }

  function handleUserState(status: UserStatus, user: Employee): void {
    setCurrUser(user);
    setUserState(status);
    openModal('alert_user_state');
  }

  function handlePageChange(current: number, pageSize: number): void {
    setPageParams({ ...pageParams, page: current, limit: pageSize });
  }

  function openExportModal(): void {
    openModal('export_employees');
  }

  // 导出数据
  function handleEmployeesExport(ids: string[]): void {
    getUserAdminInfo('', {
      useStatus: 1,
      page: 1,
      depIDs: ids,
      limit: 10000,
    }).then((res) => {
      const { data } = res;
      const newData: Employee[] = data.map((user) => {
        user.depName = user.dep && user.dep.departmentName;
        return user;
      });
      exportEmployees(newData);
      closeModal();
    }).catch((error) => {
      toast.error(error);
    });
  }

  function openModal(type: ModalType): void {
    setModalType(type);
  }

  function closeModal(): void {
    if (modalType === 'alert_user_state') {
      handleCleanChecked();
    }
    setModalType('');
  }

  // Because the data will be imported in the middle, it needs to be refreshed
  function closeFileModal(): void {
    closeModal();
    refetch();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>): void {
    setCheck(Number(e.target.checked));
  }

  function handleSelectChange(selectedRowKeys: string[], selectedRows: Employee[]): void {
    setSelectedUserIds(selectedRowKeys);
    setSelectedUsers(selectedRows);
  }

  const columns: any[] = [...EmployeesColumns];

  if (window.ADMIN_USER_FUNC_TAGS.includes('accessControl/mailList/manage')) {
    columns.push({
      Header: '操作',
      id: 'action',
      width: 40,
      accessor: (record: Employee) => {
        const menu = EmployeesActions.filter((menu) => {
          return menu.authority.includes(record?.useStatus || 0) &&
            menu.leader.includes(record?.isDEPLeader || 0);
        });
        return (
          <MoreMenu
            menus={menu}
            placement="bottom-end"
            className="opacity-1"
            onMenuClick={(key): void => {
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
      {modalType === 'export_employees' && (
        <ExportEmployees closeModal={closeModal} onSubmit={handleEmployeesExport} />
      )}
      { modalType === 'leader_handle' &&
        (<LeaderHandleModal user={currUser} closeModal={closeModal} />)}
      { modalType === 'adjust_dep' &&
        (<AdjustDepModal users={selectedUsers} closeModal={closeModal} />)}
      { modalType === 'edit_employees' &&
        (<EditEmployeesModal user={currUser} closeModal={closeModal} />)}
      { modalType === 'import_employees' &&
        (<ImportEmployeesModal currDepId={department.id} closeModal={closeFileModal} />)}
      {
        modalType === 'alert_user_state' && (<AlterUserStateModal
          status={userState}
          user={currUser}
          closeModal={closeModal}
        />)
      }
      {
        modalType === 'reset_password' && (<ResetPasswordModal
          userIds={selectedUsers.map((user) => user.id)}
          closeModal={closeModal}
          clearSelectRows={(): void => setSelectedUserIds([])}
        />)
      }

      <div className="h-full flex flex-grow flex-col">
        <div className="flex items-center ml-20 mb-20">
          <div className="text-h6">{department.departmentName}</div>
          <div className="text-12 text-gray-400">（{employeesList?.total || 0}人）</div>
        </div>
        <div className="flex items-stretch px-20 justify-between">
          <Authorized authority={['accessControl/mailList/manage']}>
            {selectedUserIds.length > 0 ? (
              <>
                <Button
                  modifier="primary"
                  iconName="device_hub"
                  onClick={(): void => openModal('adjust_dep')}
                  className="mr-16"
                >
                  调整部门
                </Button>
                <Button
                  iconName="password"
                  onClick={(): void => openModal('reset_password')}
                >
                  重置密码
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Button
                    modifier="primary"
                    iconName="create_new_folder"
                    onClick={(): void => openModal('import_employees')}
                    className="mr-16"
                  >
                  excel 批量导入
                  </Button>
                  <Button
                    iconName="add"
                    onClick={(): void => handleUserInfo(initUserInfo)}
                    className="mr-16"
                  >
                  添加员工
                  </Button>
                  <MoreMenu
                    menus={ExpandActions}
                    placement="bottom-end"
                    className="opacity-1"
                    onMenuClick={(key): void => {
                      if (key === 'export') {
                        openExportModal();
                        return;
                      }
                    }}
                  >
                    <IconButton iconName="more_horiz" />
                  </MoreMenu>
                </div>
                <CheckBox
                  onChange={handleChange}
                  label='包含子部门成员'
                />
              </>
            )}
          </Authorized>
        </div>

        <div
          className="qxp-table flex w-full border-b  mt-16 px-20"
          style={{ height: 'calc(100% - 142px)' }}
        >
          <Table
            showCheckbox
            className="text-14 h-full"
            data={employeesList?.data || []}
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
          (employeesList?.data && employeesList?.data.length > 0) && (
            <Pagination
              current={pageParams.page}
              total={employeesList?.total || 0}
              pageSize={pageParams.limit}
              onChange={handlePageChange}
              renderTotalTip={renderTotalTip}
            />
          )
        }
      </div>
    </>
  );
}
