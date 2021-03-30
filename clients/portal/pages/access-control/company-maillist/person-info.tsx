import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Table, Icon, Message } from '@QCFE/lego-ui';

import IconBtn from '@c/icon-btn';
import { Pagination } from '@c/pagination2';
import SvgIcon from '@c/icon';
import Authorized from '@clients/common/component/authorized';
import ResetPasswordModal from './modal/reset-password-modal';
import AccountHandleModal from './modal/account-handle-modal';
import AdjustDepModal from './modal/adjust-dep-modal';
import ExportFileModal from './modal/export-file-modal';
import StaffModal from './modal/staff-modal';
import { List } from '@c/list2';
import { UserInfo } from '@portal/api/auth';
import { UserStatus } from './enum';
import { DepartmentStaff } from '@c/department-staff';
import { Button } from '@c/button';
import { EmptyData } from '@c/empty-data';
import { More } from '@c/more';
import { excelHeader, exportDepExcel } from './excel';
import { uuid } from '@lib/utils';
import { usePortalGlobalValue } from '@states/portal';
import {
  getUserAdminInfo,
  setDEPLeader,
  getUserRole,
  cancelDEPLeader,
} from '@net/corporate-directory';
import UserInfoColumn from './table-column/user-info-column';
import OtherColumn from './table-column/other-column';

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
  departmentId: string;
  departmentName: string;
  keyword: string;
  handleClear(): void;
}

export default function PersonInfo({
  departmentId,
  departmentName,
  keyword,
  handleClear,
}: Props) {
  const [visibleFile, setVisibleFile] = useState<boolean>(false);
  const [resetModal, setResetModal] = useState<boolean>(false);
  const [handleModal, setHandleModal] = useState<boolean>(false);
  const [visibleAdjust, setVisibleAdjust] = useState<boolean>(false);
  const [visibleStaff, setVisibleStaff] = useState<boolean>(false);
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
    total: number;
    userName: string;
  }>({
    page: 1,
    limit: 10,
    total: 10,
    userName: '',
  });

  useEffect(() => {
    setPageParams({ ...pageParams, userName: keyword });
  }, [keyword]);

  const { data: personList, isLoading, refetch } = useQuery(
    ['GET_USER_ADMIN_INFO', pageParams, departmentId],
    () => getUserAdminInfo(departmentId, pageParams),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setPageParams({
      page: 1,
      limit: 10,
      total: 10,
      userName: '',
    });
    setSelectedRows([]);
    handleClear();
  }, [departmentId]);

  const superMutation = useMutation(setDEPLeader, {
    onSuccess: () => {
      Message.success('操作成功！');
      refetch();
    },
  });

  const setUpSuper = (params: UserInfo) => {
    superMutation.mutate({
      depID: params.dep ? params.dep.id : '',
      userID: params.id,
    });
  };

  const cancelUpSuper = (params: UserInfo) => {
    const _params: { depID: string } = {
      depID: params.dep ? params.dep.id : '',
    };
    cancelDEPLeader(_params).then((res) => {
      if (res && res.code === 0) {
        Message.success('操作成功');
        refetch();
      } else {
        Message.error('操作失败');
      }
    });
  };

  const actions = (status: UserStatus, isLeader: number) => {
    let acts: any[] = [];
    const leader = {
      id: '1',
      iconName: 'bookmark_border',
      text: '设为主管 ',
      onclick: (params: any) => setUpSuper(params),
    };
    const password = {
      id: '2',
      iconName: 'password',
      text: '重置密码',
      onclick: (params: any) => handleReset(params),
    };
    const edit = {
      id: '3',
      iconName: 'create',
      text: '修改员工信息 ',
      onclick: (params: any) => handleUserInfo(params, 'edit'),
    };
    const disable = {
      id: '4',
      iconName: 'toggle_off',
      text: '禁用账号',
      onclick: (params: any) => handleAccount(UserStatus.disable, params),
    };
    const deleted = {
      id: '5',
      iconName: 'restore_from_trash',
      text: '删除账号',
      onclick: (params: any) => handleAccount(UserStatus.delete, params),
    };
    const cancel = {
      id: '6',
      iconName: 'stop',
      text: '取消主管',
      onclick: (params: any) => cancelUpSuper(params),
    };
    const open = {
      id: '7',
      iconName: 'toggle_on',
      text: '开启账号',
      onclick: (params: any) => handleAccount(UserStatus.normal, params),
    };

    if (status === UserStatus.normal) {
      acts = [edit, leader, password, disable, deleted];
    }

    if (status === UserStatus.disable) {
      acts = [open, deleted];
    }

    if (isLeader === UserStatus.normal && status !== UserStatus.disable) {
      acts[1] = cancel;
    }

    return acts;
  };

  const handleUserInfo = (params: UserInfo, status: 'add' | 'edit') => {
    if (status === 'edit') {
      getUserRole({ ownerID: params.id, type: 1 }).then((roles) => {
        const _params = {
          ...params,
          roleId: '',
          deleteId: '',
        };
        if (roles && roles.length > 0) {
          _params.roleId = roles[0].roleID;
          _params.deleteId = roles[0].id;
        }
        setCurrUser(_params);
        setVisibleStaff(true);
      });
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
    setVisibleAdjust(!visibleStaff);
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
      render: (text: any, record?: UserInfo) => {
        return (
          <More<UserInfo>
            items={
              actions(
                  (record && record.useStatus) as UserStatus,
                  (record && record.isDEPLeader) as unknown as number,
              )
            }
            params={record}
            contentClassName="mr-8"
          >
            <Icon name="more" style={{ transform: 'rotate(90deg)' }} />
          </More>
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
      { visibleAdjust && <AdjustDepModal userList={selectedUsers} closeModal={handleAdjustModal} />}
      { visibleStaff && <StaffModal user={currUser} closeModal={closeStaffModal} />}
      { visibleFile && <ExportFileModal currDepId={departmentId} closeModal={closeFileModal} />}
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

      <div className="flex-1 h-full flex-column">
        <DepartmentStaff
          department={departmentName}
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
        <div className="w-full mt-16 flex-column flex-1 px-20 overflow-auto">
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
