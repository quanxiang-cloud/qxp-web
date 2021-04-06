import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Table, Message } from '@QCFE/lego-ui';

import SvgIcon from '@c/icon';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import Authorized from '@clients/components/authorized';
import Button from '@c/button';
import MoreMenu from '@c/more-menu';
import { usePortalGlobalValue } from '@portal/states/portal';

import { getUserAdminInfo } from './api';
import EditEmployeesModal from './modal/edit-employees-modal';
import ImportEmployeesModal from './modal/import-employees-modal';
import ResetPasswordModal from './modal/reset-password-modal';
import AlterUserStateModal from './modal/alert-user-state-modal';
import AdjustDepModal from './modal/adjust-dep-modal';
import LeaderHandleModal from './modal/leader-handle-modal';

import { exportEmployees } from './utils';
import { UserStatus } from './type';
import { EmployeesColumns, EmployeesActions, ExpandActions } from './constant';

type ModalType = '' | 'edit_employees' | 'import_employees' | 'reset_password' |
  'alert_user_state' | 'adjust_dep' | 'leader_handle';

const initUserInfo = { id: '', userName: '', email: '', phone: '' };
const initSearch = { page: 1, limit: 10, userName: '' };

interface Props {
  department: Department;
  searchWord: string;
}

export default function Employees({
  department,
  searchWord,
}: Props) {
  const [modalType, setModalType] = useState<ModalType>('');
  const [userState, setUserState] = useState<UserStatus>(UserStatus.normal);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [currUser, setCurrUser] = useState<UserInfo>(initUserInfo);
  const [pageParams, setPageParams] = React.useState(initSearch);
  const [{ userInfo }] = usePortalGlobalValue();

  const { data: employeesList, isLoading, refetch } = useQuery(
    ['GET_USER_ADMIN_INFO', pageParams, department.id],
    () => getUserAdminInfo(department.id, pageParams),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setPageParams({ ...pageParams, userName: searchWord });
  }, [searchWord]);

  useEffect(() => {
    setPageParams(initSearch);
    setSelectedUserIds([]);
  }, [department.id]);

  function handleDepLeader(params: UserInfo) {
    setCurrUser(params);
    openModal('leader_handle');
  }

  function handleUserInfo(user: UserInfo) {
    setCurrUser(user);
    openModal('edit_employees');
  }

  function handleResetPWD(user: UserInfo) {
    setSelectedUsers([user]);
    openModal('reset_password');
  }

  function handleUserState(status: UserStatus, user: UserInfo) {
    setCurrUser(user);
    setUserState(status);
    openModal('alert_user_state');
  }

  function handlePageChange(current: number) {
    setPageParams({ ...pageParams, page: current });
  }

  function handlePageSizeChange(limit: number) {
    setPageParams({
      ...pageParams,
      page: 1,
      limit,
    });
  }

  function handleEmployeesExport() {
    getUserAdminInfo('', {
      useStatus: 1,
      page: 1,
      limit: 10000,
    }).then((res) => {
      if (res && res.data) {
        const { data } = res;
        const newData: UserInfo[] = data.map((user) => {
          user.depName = user.dep && user.dep.departmentName;
          return user;
        });
        exportEmployees(newData);
      } else {
        Message.error('获取人员出错');
      }
    });
  }

  function openModal(type: ModalType) {
    setModalType(type);
  }

  function closeModal() {
    setModalType('');
  }

  // Because the data will be imported in the middle, it needs to be refreshed
  function closeFileModal() {
    closeModal();
    refetch();
  }

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    getCheckboxProps: (record: any) => ({
      disabled: record.useStatus === -2,
      name: record.id,
    }),
    onChange: (selectedRowKeys: string[], selectedRows: UserInfo[]) => {
      setSelectedUserIds(selectedRowKeys);
      setSelectedUsers(selectedRows);
    },
  };

  const columns: Columns = [...EmployeesColumns];
  if (userInfo.authority.includes('accessControl/mailList/manage')) {
    columns.push({
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: string, record: UserInfo)=> {
        const menu = EmployeesActions.filter((menu) => {
          return menu.authority.includes(record?.useStatus || 0) &&
          menu.leader.includes(record?.isDEPLeader || 0);
        });
        return (
          <MoreMenu
            menus={menu}
            placement="bottom-end"
            className="opacity-1"
            onChange={(key) => {
              if (key === 'edit') {
                handleUserInfo(record);
                return;
              }
              if (key === 'confer' || key === 'revoke' ) {
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
          clearSelectRows={() => setSelectedUserIds([])}
        />)
      }

      <div className="h-full flex flex-grow flex-col overflow-hidden">
        <div className="flex items-center ml-20 mb-20">
          <div className="text-h6">{department.departmentName}</div>
          <div className="text-12 text-gray-400">（{employeesList?.total || 0}人）</div>
        </div>
        <div className="flex items-stretch px-20">
          <Authorized authority={['accessControl/mailList/manage']}>
            {selectedUserIds.length > 0 ? (
              <>
                <Button
                  className="bg-black-900"
                  textClassName="text-white"
                  icon={<SvgIcon name="device_hub" type="light" size={20} className="mr-10" />}
                  onClick={() => openModal('adjust_dep')}
                >
                调整部门
                </Button>
                <div className="w-16"></div>
                <Button
                  icon={<SvgIcon name="password" className="mr-10" size={20} />}
                  onClick={() => openModal('reset_password')}
                >
                重置密码
                </Button>
              </>
            ) : (
              <>
                <Button
                  icon={(<SvgIcon type="light" name="create_new_folder"
                    className="mr-10" size={20} />)}
                  onClick={() => openModal('import_employees')}
                  className="mr-16 bg-gray-700 text-white"
                >
                excel 批量导入
                </Button>
                <Button
                  icon={<SvgIcon name="add" className="mr-10" size={20} />}
                  onClick={() => handleUserInfo(initUserInfo)}
                  className="mr-16"
                >
                添加员工
                </Button>
                <MoreMenu
                  menus={ExpandActions}
                  placement="bottom-end"
                  className="opacity-1"
                  onChange={(key) => {
                    if (key === 'export') {
                      handleEmployeesExport();
                      return;
                    }
                  }}
                >
                  <div className="p-6 bg-gray-700 text-white btn-border-radius cursor-pointer">
                    <SvgIcon type="light" name="more_horiz" size={20} />
                  </div>
                </MoreMenu>
              </>
            )}
          </Authorized>
        </div>
        <div className="h-full flex flex-grow my-16 flex-col px-20 overflow-auto">

          {
            (employeesList?.data && employeesList?.data.length > 0) && (
              <div className="qxp-table flex w-full border-b">
                <Table
                  className="text-14 table-full"
                  dataSource={employeesList?.data || []}
                  columns={columns}
                  rowKey="id"
                  rowSelection={rowSelection}
                  // emptyText={<EmptyTips text="无成员数据" className="py-32" />}
                  loading={isLoading}
                />
              </div>)
          }
          {
            (employeesList?.data && employeesList?.data.length === 0) && (
              <div className="qxp-table w-full flex items-center justify-center">
                <EmptyTips text="无成员数据" className="py-32" />
              </div>)
          }
        </div>
        <div className="flex justify-end">
          {
            (employeesList?.data && employeesList?.data.length > 0) && (<Pagination
              type="simple"
              current={pageParams.page}
              total={employeesList?.total || 0}
              pageSize={pageParams.limit}
              onChange={handlePageChange}
              onShowSizeChange={handlePageSizeChange}
            />)
          }
        </div>
      </div>
    </>
  );
}
