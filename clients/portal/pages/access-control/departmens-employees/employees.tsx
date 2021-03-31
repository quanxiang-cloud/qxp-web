import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Table, Icon, Message } from '@QCFE/lego-ui';

import IconBtn from '@c/icon-btn';
import Pagination from '@c/pagination2';
import SvgIcon from '@c/icon';
import Authorized from '@clients/common/component/authorized';
import List from '@portal/components/list';
import DepartmentStaff from '@c/department-staff';
import Button from '@c/button';
import EmptyData from '@c/empty-data';
import More from '@c/more';
import MoreMenu, { MenuItem } from '@c/more-menu';
import { uuid } from '@lib/utils';
import { UserInfo } from '@portal/api/auth';
import { usePortalGlobalValue } from '@states/portal';
import { getUserAdminInfo } from '@net/corporate-directory';

import ResetPasswordModal from './modal/reset-password-modal';
import AccountHandleModal from './modal/account-handle-modal';
import AdjustDepModal from './modal/adjust-dep-modal';
import ExportFileModal from './modal/export-file-modal';
import StaffModal from './modal/staff-modal';
import LeaderHandleModal from './modal/leader-handle-modal';
import UserInfoColumn from './table-column/user-info-column';
import OtherColumn from './table-column/other-column';
import { excelHeader, exportDepExcel } from './excel';
import { UserStatus, LeaderStatus } from './enum';

type AuthorMenuItem<T> = {
  authority: number[];
  leader: number[];
} & MenuItem<T>;

const MENUS: AuthorMenuItem<string>[] = [
  {
    key: 'edit',
    label: (
      <div className="flex items-center">
        <SvgIcon name="create" size={16} className="mr-8" />
        <span className="font-normal">修改员工信息</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
  {
    key: 'leader',
    label: (
      <div className="flex items-center">
        <SvgIcon name="bookmark_border" size={16} className="mr-8" />
        <span className="font-normal">设为主管</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.false],
  },
  {
    key: 'cancel',
    label: (
      <div className="flex items-center">
        <SvgIcon name="cancel" size={16} className="mr-8" />
        <span className="font-normal">取消主管</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.true],
  },
  {
    key: 'reset',
    label: (
      <div className="flex items-center">
        <SvgIcon name="password" size={16} className="mr-8" />
        <span className="font-normal">重置密码</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
  {
    key: 'disable',
    label: (
      <div className="flex items-center">
        <SvgIcon name="toggle_off" size={16} className="mr-8" />
        <span className="font-normal">禁用账号</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
  {
    key: 'enable',
    label: (
      <div className="flex items-center">
        <SvgIcon name="toggle_on" size={16} className="mr-8" />
        <span className="font-normal">启用账号</span>
      </div>
    ),
    authority: [UserStatus.disable],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
  {
    key: 'delete',
    label: (
      <div className="flex items-center">
        <SvgIcon name="restore_from_trash" size={16} className="mr-8" />
        <span className="font-normal">删除账号</span>
      </div>
    ),
    authority: [UserStatus.normal, UserStatus.disable],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
];

enum ResetStart {
  single = 0,
  batch = 1
}

const pageSizeOptions = [10, 20, 50, 100];

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
  const [visibleFile, setVisibleFile] = useState<boolean>(false);
  const [resetModal, setResetModal] = useState<boolean>(false);
  const [handleModal, setHandleModal] = useState<boolean>(false);
  const [visibleAdjust, setVisibleAdjust] = useState<boolean>(false);
  const [visibleStaff, setVisibleStaff] = useState<boolean>(false);
  const [visibleLeader, setVisibleLeader] = useState<boolean>(false);
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

  useEffect(() => {
    setPageParams({ ...pageParams, userName: keyword });
  }, [keyword]);

  const { data: personList, isLoading, refetch } = useQuery(
    ['GET_USER_ADMIN_INFO', pageParams, department.id],
    () => getUserAdminInfo(department.id, pageParams),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setPageParams({
      page: 1,
      limit: 10,
      userName: '',
    });
    setSelectedRows([]);
  }, [department.id]);

  const setUpSuper = (params: UserInfo) => {
    setCurrUser(params);
    setVisibleLeader(true);
  };

  const handleUserInfo = (params: UserInfo, status: 'add' | 'edit') => {
    if (status === 'edit') {
      setCurrUser(params);
      setVisibleStaff(true);
    } else {
      setCurrUser({
        id: '',
        userName: '',
        email: '',
        phone: '',
      });
      setVisibleStaff(true);
    }
  };

  const handleReset = (params: UserInfo) => {
    setResetStart(ResetStart.single);
    setCurrUser(params);
    setResetModal(true);
  };

  const openSendPwd = () => {
    setResetStart(ResetStart.batch);
    setResetModal(true);
  };

  const closeResetModal = () => {
    setResetModal(false);
  };

  const handleAccount = (status: UserStatus, params: UserInfo): void => {
    setCurrUser(params);
    setModalStatus(status);
    setHandleModal(true);
  };

  const closeHandleModal = () => {
    setHandleModal(false);
  };

  const handleChange = (current: number) => {
    setPageParams({ ...pageParams, page: current });
  };

  const handleShowSizeChange = (limit: number) => {
    setPageParams({
      ...pageParams,
      page: 1,
      limit,
    });
  };

  const importFile = () => {
    setVisibleFile(true);
  };

  const closeFileModal = () => {
    setVisibleFile(false);
    refetch();
  };

  const closeStaffModal = () => {
    setVisibleStaff(!visibleStaff);
  };

  const handleAdjustModal = () => {
    setVisibleAdjust(!visibleAdjust);
  };

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
        exportDepExcel(excelHeader, newData, '人员列表.xlsx');
      } else {
        Message.error('获取人员出错');
      }
    });
  };


  const expandActions = [
    {
      id: '1',
      iconName: 'exit_to_app',
      text: '导出员工数据 ',
      onclick: () => exportDepData(),
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      render: (text: string, record: UserInfo) => <UserInfoColumn userinfo={record} />,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      render: (text: string, record: UserInfo) => {
        return <OtherColumn columnKey='phone' userinfo={record} />;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      // width: 150,
      render: (text: string, record: UserInfo) => {
        return <OtherColumn columnKey='email' userinfo={record} />;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      render: (text: string, record: UserInfo) => {
        return <OtherColumn columnKey='dep' userinfo={record} />;
      },
    },
  ];

  if (userInfo.authority.includes('accessControl/mailList/manage')) {
    columns.push({
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: string, record: UserInfo)=> {
        const menu = MENUS.filter((menu) => {
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
              if (key === 'leader') {
                setUpSuper(record);
              }
              if (key === 'cancel') {
                setUpSuper(record);
                return;
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
      { visibleLeader &&
      <LeaderHandleModal user={currUser} closeModal={() => setVisibleLeader(false)} />}
      { visibleAdjust && <AdjustDepModal userList={selectedUsers} closeModal={handleAdjustModal} />}
      { visibleStaff && <StaffModal user={currUser} closeModal={closeStaffModal} />}
      { visibleFile && <ExportFileModal currDepId={department.id} closeModal={closeFileModal} />}
      {
        handleModal && <AccountHandleModal
          status={modalStatus}
          user={currUser}
          closeModal={closeHandleModal}
        />
      }
      {
        resetModal && <ResetPasswordModal
          userIds={resetStart === ResetStart.single ? [currUser.id] : selectedRows}
          closeModal={closeResetModal}
          clearSelectRows={clearSelectRows}
        />
      }

      <div className="h-full flex flex-grow flex-col overflow-hidden">
        <DepartmentStaff
          department={department.departmentName}
          count={personList?.total || 0}
          unit="人"
        />
        <div className="flex items-stretch px-20">
          {selectedRows.length > 0 ? (
            <Authorized authority={['accessControl/mailList/manage']}>
              <Button
                className="bg-black-900"
                textClassName="text-white"
                icon={<SvgIcon name="device_hub" type="light" size={20} className="mr-10" />}
                onClick={handleAdjustModal}
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
                onClick={importFile}
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
              personList?.data && <Table
                className="text-14 table-full"
                dataSource={personList?.data || []}
                columns={columns}
                rowKey="id"
                rowSelection={rowSelection}
                emptyText={<EmptyData text="无成员数据" className="py-32" />}
                loading={isLoading}
              />
            }

          </div>
          <div className="flex justify-end">
            {
              personList?.data && <Pagination
                type="simple"
                current={pageParams.page}
                total={personList?.total || 0}
                pageSize={pageParams.limit}
                pageSizeOptions={pageSizeOptions}
                onChange={handleChange}
                onShowSizeChange={handleShowSizeChange}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}
