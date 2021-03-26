import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Table, Icon, Message } from '@QCFE/lego-ui';

import Button2 from '@c/button2';
import IconBtn from '@c/icon-btn';
import { Pagination } from '@portal/components/pagination2';
import { ResetPasswordModal, CheckedWay } from './reset-password-modal';
import { AccountHandleModal } from './account-handle-modal';
import { StaffModal, FormValues, EditFormValues } from './staff-modal';
import { List } from '@portal/components/list2';
import { DepartmentStaff } from '@portal/components/department-staff';
import { Button } from '@portal/components/button';
import { ExportFileModal } from './export-file-modal';
import { AdjustDepModal } from './adjust-dep-modal';
import { EmptyData } from '@portal/components/empty-data';
import { More } from '@portal/components/more';
import { IUserInfo } from '@portal/api/auth';
import { excelHeader, exportDepExcel, getImgColor } from './excel';
import { uuid } from '@assets/lib/utils';
import Authorized from '@clients/common/component/authorized';
import { usePortalGlobalValue } from '@clients/common/state/portal';
import {
  getUserAdminInfo,
  updateUserStatus,
  addDepUser,
  updateUser,
  resetUserPWD,
  setDEPLeader,
  batchAdjustDep,
  getUserRole,
  cancelDEPLeader,
} from './api';

export type UserStatus = 1 | -1 | -2; // 1 正常 -2 禁用 -1 删除
type ResetStart = 0 | 1; // 0是单个，1批量

export type BatchDepParams = {
  usersID: string[];
  oldDepID: string;
  newDepID: string;
};

interface PersonInfoProps {
  departmentId: string;
  departmentName: string;
  keyword: string;
  handleClear(): void;
}

export const PersonInfo = React.memo(({
  departmentId,
  departmentName,
  keyword,
  handleClear,
}: PersonInfoProps) => {
  const [visibleFile, setVisibleFile] = useState<boolean>(false);
  const [resetModal, setResetModal] = useState<boolean>(false);
  const [handleModal, setHandleModal] = useState<boolean>(false);
  const [visibleAdjust, setVisibleAdjust] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<UserStatus>(1);
  const [resetStart, setResetStart] = useState<ResetStart>(0);
  const [userModalStatus, setUserModalStatus] = useState<'add' | 'edit'>('add');
  const [visibleStaff, setVisibleStaff] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUserInfo[]>([]);
  const [{ userInfo }] = usePortalGlobalValue();

  const staffMutation = useMutation(
    userModalStatus === 'add' ? addDepUser : updateUser,
    {
      onSuccess: (data) => {
        if (data && data.code === 0) {
          Message.success('操作成功');
          refetch();
        } else {
          Message.error(data?.msg || '操作失败');
        }
        setVisibleStaff(false);
      },
    }
  );

  const [currUser, setCurrUser] = useState<IUserInfo>({
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
    ['getUserAdminInfo', pageParams, departmentId],
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

  const handleMutation = useMutation(updateUserStatus, {
    onSuccess: () => {
      setHandleModal(false);
      refetch();
    },
  });

  const superMutation = useMutation(setDEPLeader, {
    onSuccess: () => {
      Message.success('操作成功！');
      refetch();
    },
  });

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: (data) => {
      if (data && data.code === 0) {
        Message.success('操作成功！');
      } else {
        Message.error('操作失败！');
      }
      setVisibleFile(false);
      setResetModal(false);
      setSelectedRows([]);
    },
  });

  const depMutation = useMutation(batchAdjustDep, {
    onSuccess: () => {
      setVisibleAdjust(false);
      refetch();
    },
  });

  const pageSizeOptions = [10, 20, 50, 100];

  const setUpSuper = (params: IUserInfo) => {
    superMutation.mutate({
      depID: params.dep ? params.dep.id : '',
      userID: params.id,
    });
  };

  const cancelUpSuper = (params: IUserInfo) => {
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
      iconName: 'client',
      text: '设为主管 ',
      onclick: (params: any) => setUpSuper(params),
    };
    const password = {
      id: '2',
      iconName: 'key',
      text: '重置密码',
      onclick: (params: any) => handleReset(params),
    };
    const edit = {
      id: '3',
      iconName: 'pen',
      text: '修改信息 ',
      onclick: (params: any) => handleUserInfo(params, 'edit'),
    };
    const disable = {
      id: '4',
      iconName: 'stop',
      text: '禁用账号',
      onclick: (params: any) => handleAccount(-2, params),
    };
    const deleted = {
      id: '5',
      iconName: 'trash',
      text: '删除账号',
      onclick: (params: any) => handleAccount(-1, params),
    };
    const cancel = {
      id: '6',
      iconName: 'stop',
      text: '取消主管',
      onclick: (params: any) => cancelUpSuper(params),
    };
    const open = {
      id: '7',
      iconName: 'stop',
      text: '启用账号',
      onclick: (params: any) => handleAccount(1, params),
    };

    if (status === 1) {
      acts = [leader, password, edit, disable, deleted];
    }

    if (status === -2) {
      acts = [open, deleted];
    }

    if (isLeader === 1 && status !== -2) {
      acts[0] = cancel;
    }

    return acts;
  };

  const handleUserInfo = (params: IUserInfo, status: 'add' | 'edit') => {
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
        setUserModalStatus(status);
      });
    } else {
      setCurrUser(params);
      setVisibleStaff(true);
      setUserModalStatus(status);
    }
  };

  const handleReset = (params: IUserInfo) => {
    setResetStart(0);
    setCurrUser(params);
    setResetModal(true);
  };

  const openSendPwd = () => {
    setResetStart(1);
    setResetModal(true);
  };

  const closeResetModal = () => {
    setResetModal(false);
  };

  const handleAccount = (status: UserStatus, params: IUserInfo): void => {
    setCurrUser(params);
    setModalStatus(status);
    setHandleModal(true);
  };

  const closeHandleModal = () => {
    setHandleModal(false);
  };

  const okHandleModal = () => {
    handleMutation.mutate({ id: currUser.id, status: modalStatus });
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

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      render: (text: string, record: IUserInfo) => {
        const head: string = text.substring(0, 1);
        const bgColor = getImgColor(head);
        return (
          <div className="flex items-center">
            <div className="pr-8">
              <div className="relative w-24 h-24 rounded-br-4 rounded-l-4
              text-center leading-24 text-white text-14"
              style={{
                backgroundColor: bgColor,
              }}
              >
                {head}
                <div className="w-10 h-10 bg-white rounded-10 flex items-center
                justify-center absolute -bottom-5 -right-5">
                  {record.useStatus === 1 && (
                    <div className="w-6 h-6 bg-green-600 rounded-6"></div>
                  )}
                  {record.useStatus === -2 && (
                    <div className="w-6 h-6 bg-red-600 rounded-6"></div>
                  )}
                </div>
              </div>
            </div>

            {record.useStatus === -2 ?
              <span className="mr-1 text-gray-400">{text}</span> :
              <span className="mr-1">{text}</span>}
            {record.isDEPLeader === 1 && (
              <span
                className='bg-jb rounded-4 px-2 flex items-center justify-center'
              >
                <span className="text-white text-12">主管</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      render: (text: string, record: IUserInfo) => {
        return (record.useStatus === -2 ?
          <span className="mr-1 text-gray-400">{text}</span>:
          <span className="mr-1">{text}</span>);
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      // width: 150,
      render: (text: string, record: IUserInfo) => {
        return (record.useStatus === -2 ?
          <span className="mr-1 text-gray-400">{text}</span>:
          <span className="mr-1">{text}</span>
        );
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      render: (text: string, record: IUserInfo) => {
        return (
          record.useStatus === -2 ?
            <span className="mr-1 text-gray-400">
              {record.dep && record.dep.departmentName}
            </span>:
            <span className="mr-1">{record.dep && record.dep.departmentName}</span>
        );
      },
    },
  ];

  if (userInfo.authority.includes('accessControl/mailList/manage')) {
    columns.push({
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: any, record?: IUserInfo) => {
        return (
          <More<IUserInfo>
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
    onChange: (selectedRowKeys: string[], selectedRows: IUserInfo[]) => {
      setSelectedRows(selectedRowKeys);
      setSelectedUsers(selectedRows);
    },
  };

  // 打开文件模态框
  const importFile = () => {
    setVisibleFile(true);
  };

  // 关闭文件模态框
  const closeFileModal = () => {
    setVisibleFile(false);
    refetch();
  };

  const okStaffModal = (values: FormValues | EditFormValues) => {
    if (userModalStatus === 'edit') {
      values.id = currUser.id;
    }
    staffMutation.mutate(values);
  };

  const closeStaffModal = () => {
    setVisibleStaff(false);
  };

  const okResetModal = (checkedWay: CheckedWay) => {
    if (resetStart === 0) {
      resetMutation.mutate({ userIDs: [currUser.id], ...checkedWay });
    } else {
      resetMutation.mutate({ userIDs: selectedRows, ...checkedWay });
    }
  };

  const okExportModal = (ids: string[], way: CheckedWay) => {
    resetMutation.mutate({ userIDs: ids, ...way });
  };

  const openAdjustModal = () => {
    setVisibleAdjust(true);
  };

  const okModalAdjust = (params: BatchDepParams) => {
    depMutation.mutate(params);
  };

  const exportDepData = () => {
    getUserAdminInfo('', {
      useStatus: 1,
      page: 0,
      limit: 0,
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
      iconName: 'export',
      text: '导出员工数据 ',
      onclick: () => exportDepData(),
    },
  ];

  return (
    <>
      <AdjustDepModal
        userList={selectedUsers}
        visible={visibleAdjust}
        closeModal={() => setVisibleAdjust(false)}
        okModal={okModalAdjust}
      />
      {/* 员工模态框 */}
      <StaffModal
        visible={visibleStaff}
        status={userModalStatus}
        initData={currUser}
        okModal={okStaffModal}
        closeModal={closeStaffModal}
      />
      {/* 文件处理模态框 */}
      <ExportFileModal
        visible={visibleFile}
        currDepId={departmentId}
        closeModal={closeFileModal}
        okModal={okExportModal}
      />
      <AccountHandleModal
        visible={handleModal}
        status={modalStatus}
        initData={currUser}
        closeModal={closeHandleModal}
        okModal={okHandleModal}
      />
      <ResetPasswordModal
        visible={resetModal}
        closeModal={closeResetModal}
        okModal={okResetModal}
      />
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
                icon={
                  <svg
                    className="mr-4"
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      // eslint-disable-next-line max-len
                      d="M15.6667 1.99998H9.00008L7.33342 0.333313H2.33341C1.40841 0.333313 0.675081 1.07498 0.675081 1.99998L0.666748 12C0.666748 12.925 1.40841 13.6666 2.33341 13.6666H15.6667C16.5917 13.6666 17.3334 12.925 17.3334 12V3.66665C17.3334 2.74165 16.5917 1.99998 15.6667 1.99998ZM15.6667 12H2.33341V1.99998H6.64175L8.30841 3.66665H15.6667V12ZM9.00008 8.66665H10.6667V10.3333H12.3334V8.66665H14.0001V6.99998H12.3334V5.33331H10.6667V6.99998H9.00008V8.66665Z"
                      fill="white"
                    />
                  </svg>
                }
                onClick={openAdjustModal}
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
              <Button2 isPrimary icon="folder" onClick={importFile} className="mr-16">
                excel 批量导入
              </Button2>
              <Button2
                icon="add"
                onClick={() => handleUserInfo({
                  id: '', userName: '', phone: '', email: '',
                }, 'add')}
                className="mr-16"
              >
                添加员工
              </Button2>
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
});
