import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Table, Icon, Message } from '@QCFE/lego-ui';

import SvgIcon from '@c/icon';
import EmptyTips from '@c/empty-tips';
import IconBtn from '@c/icon-btn';
import Pagination from '@c/pagination';
import Authorized from '@clients/common/component/authorized';
// todo replace by button2
import Button from '@c/button';
// todo replace this by more-menu component
import MoreMenu from '@c/more-menu';

// remove this type definition to global d.ts
import { UserInfo } from '@portal/api/auth';
import { getUserAdminInfo } from '@net/corporate-directory';
// todo windows
import { usePortalGlobalValue } from '@states/portal';

import List from '@c/list';
import More from '@c/more';
import { uuid } from '@lib/utils';

import EditEmployeesModal from './modal/edit-employees-modal';
import ImportEmployeesModal from './modal/import-employees-modal';
import ResetPasswordModal from './modal/reset-password-modal';
import AlterUserStateModal from './modal/alert-user-state-modal';
import AdjustDepModal from './modal/adjust-dep-modal';
import LeaderHandleModal from './modal/leader-handle-modal';

import { exportEmployees } from './excel';
import { UserStatus } from './enum';
import { EmployeesColumns, EmplayeesActions, ExpandActions } from './constant';

enum ResetStart {
  single = 0,
  batch = 1
}

type modalType = '' | 'edit_employees' | 'import_employees' | 'reset_password' |
  'alert_user_state' | 'adjust_dep' | 'leader_handle';

export type BatchDepParams = {
  usersID: string[];
  oldDepID: string;
  newDepID: string;
};

interface Props {
  department: Department;
  keyword: string;
}

export default function Employees({
  department,
  keyword,
}: Props) {
  const [modayType, setModalType] = useState<modalType>('');
  const [modalStatus, setModalStatus] = useState<UserStatus>(UserStatus.normal);
  const [resetStart, setResetStart] = useState<ResetStart>(ResetStart.single);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [{ userInfo }] = usePortalGlobalValue();
  const [currUser, setCurrUser] = useState<UserInfo>({
    id: '',
    userName: '',
    email: '',
    phone: '',
  });
  const [pageParams, setPageParams] = React.useState<{
    page: number;
    limit: number;
    userName: string;
  }>({
    page: 1,
    limit: 10,
    userName: '',
  });

  const { data: employeesList, isLoading, refetch } = useQuery(
    ['GET_USER_ADMIN_INFO', pageParams, department.id],
    () => getUserAdminInfo(department.id, pageParams),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setPageParams({ ...pageParams, userName: keyword });
  }, [keyword]);

  useEffect(() => {
    setPageParams({
      page: 1,
      limit: 10,
      userName: '',
    });
    setSelectedRows([]);
  }, [department.id]);

  function setUpSuper(params: UserInfo) {
    setCurrUser(params);
    setModalType('leader_handle');
  }

  function handleUserInfo(params: UserInfo, status: 'add' | 'edit') {
    if (status === 'edit') {
      setCurrUser(params);
      setModalType('edit_employees');
      return;
    }
    setCurrUser({
      id: '',
      userName: '',
      email: '',
      phone: '',
    });
    setModalType('edit_employees');
  }

  const handleReset = (params: UserInfo) => {
    setResetStart(ResetStart.single);
    setCurrUser(params);
    setModalType('reset_password');
  };

  const openSendPwd = () => {
    setResetStart(ResetStart.batch);
    setModalType('reset_password');
  };

  const handleAccount = (status: UserStatus, params: UserInfo): void => {
    setCurrUser(params);
    setModalStatus(status);
    setModalType('edit_employees');
  };

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
  const clearSelectRows = () => {
    setSelectedRows([]);
  };

  const exportDepData = () => {
    getUserAdminInfo('', {
      useStatus: 1,
      page: 1,
      limit: 10000,
    }).then((res) => {
      if (res && res.data) {
        const { data } = res;
        const newData = data.map((user) => {
          user.depName = user.dep && user.dep.departmentName;
          return user;
        });
        exportEmployees(newData);
      } else {
        Message.error('获取人员出错');
      }
    });
  };

  const columns = [...EmployeesColumns];
  if (userInfo.authority.includes('accessControl/mailList/manage')) {
    columns.push({
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: string, record: UserInfo)=> {
        const menu = EmplayeesActions.filter((menu) => {
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
                handleUserInfo(record, 'edit');
                return;
              }
              if (key === 'leader' || key === 'cancel' ) {
                setUpSuper(record);
              }

              if (key === 'reset') {
                handleReset(record);
                return;
              }
              if (key === 'disable') {
                handleAccount(UserStatus.disable, record);
              }
              if (key === 'enable') {
                handleAccount(UserStatus.normal, record);
              }
              if (key === 'delete') {
                handleAccount(UserStatus.delete, record);
                return;
              }
            }}
          />
        );
      },
    });
  }

  function openModal(type: modalType) {
    setModalType(type);
  }

  function closeModal() {
    setModalType('');
  }

  // Because the data will be imported in the middle, it needs to be refreshed
  function closeFileModal() {
    setModalType('');
    refetch();
  }

  const expandActions = [
    {
      id: '1',
      iconName: 'exit_to_app',
      text: '导出员工数据 ',
      onclick: () => exportDepData(),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
    getCheckboxProps: (record: any) => ({
      disabled: record.useStatus === -2,
      name: record.id,
    }),
    onChange: (selectedRowKeys: string[], selectedRows: UserInfo[]) => {
      setSelectedRows(selectedRowKeys);
      setSelectedUsers(selectedRows);
    },
  };

  return (
    <>
      { modayType === 'leader_handle' &&
      (<LeaderHandleModal user={currUser} closeModal={closeModal} />)}
      { modayType === 'adjust_dep' &&
      (<AdjustDepModal userList={selectedUsers} closeModal={closeModal} />)}
      { modayType === 'edit_employees' &&
      (<EditEmployeesModal user={currUser} closeModal={closeModal} />)}
      { modayType === 'import_employees' &&
      (<ImportEmployeesModal currDepId={department.id} closeModal={closeFileModal} />)}
      {
        modayType === 'alert_user_state' && (<AlterUserStateModal
          status={modalStatus}
          user={currUser}
          closeModal={closeModal}
        />)
      }
      {
        modayType === 'reset_password' && (<ResetPasswordModal
          userIds={resetStart === ResetStart.single ? [currUser.id] : selectedRows}
          closeModal={closeModal}
          clearSelectRows={clearSelectRows}
        />)
      }

      <div className="h-full flex flex-grow flex-col overflow-hidden">
        <div className="flex items-center ml-20 mb-20">
          <div className="text-h6">{department.departmentName}</div>
          <div className="text-12 text-gray-400">（{employeesList?.total || 0}人）</div>
        </div>
        <div className="flex items-stretch px-20">
          {selectedRows.length > 0 ? (
            <Authorized authority={['accessControl/mailList/manage']}>
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
                icon={<Icon className="mr-12" name="add" />}
                onClick={openSendPwd}
              >
                重置密码
              </Button>
            </Authorized>
          ) : (
            <Authorized authority={['accessControl/mailList/manage']}>
              <Button
                icon={<SvgIcon type="light" name="create_new_folder" className="mr-10" size={20} />}
                onClick={() => openModal('import_employees')}
                className="mr-16 bg-gray-700 text-white"
              >
                excel 批量导入
              </Button>
              <Button
                icon={<SvgIcon name="add" className="mr-10" size={20} />}
                onClick={() => handleUserInfo({
                  id: '', userName: '', phone: '', email: '',
                }, 'add')}
                className="mr-16"
              >
                添加员工
              </Button>
              <More
                items={[<List key={uuid()} items={expandActions} />]}
                contentClassName="mr-8"
              >
                <IconBtn iconName="more" style={{ transform: 'rotate(90deg)' }} />
              </More>
            </Authorized>
          )}
        </div>
        <div className="h-full flex flex-grow my-16 flex-col px-20 overflow-auto">
          <div className="qxp-table flex w-full border-b">
            {
              (employeesList?.data && employeesList?.data.length > 0) && (<Table
                className="text-14 table-full"
                dataSource={employeesList?.data || []}
                columns={columns}
                rowKey="id"
                rowSelection={rowSelection}
                // emptyText={<EmptyTips text="无成员数据" className="py-32" />}
                loading={isLoading}
              />)
            }
            {
              (employeesList?.data && employeesList?.data.length === 0) && (<div className="w-full">
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
      </div>
    </>
  );
}
