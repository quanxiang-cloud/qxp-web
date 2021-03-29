import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Table, Icon, Message } from '@QCFE/lego-ui';

import IconBtn from '@c/icon-btn';
import { Pagination } from '@c/pagination2';
import SvgIcon from '@c/icon';
import { ResetPasswordModal, CheckedWay } from './modal/reset-password-modal';
import { AccountHandleModal } from './modal/account-handle-modal';
import StaffModal from './modal/staff-modal';
import { List } from '@c/list2';
import { UserInfo } from '@portal/api/auth';
import { UserStatus } from './enum';
import { DepartmentStaff } from '@c/department-staff';
import { Button } from '@c/button';
import { ExportFileModal } from './modal/export-file-modal';
import { AdjustDepModal } from './modal/adjust-dep-modal';
import { EmptyData } from '@c/empty-data';
import { More } from '@c/more';
import { excelHeader, exportDepExcel } from './excel';
import { uuid } from '@lib/utils';
import Authorized from '@clients/common/component/authorized';
import { usePortalGlobalValue } from '@states/portal';
import {
  getUserAdminInfo,
  updateUserStatus,
  resetUserPWD,
  setDEPLeader,
  batchAdjustDep,
  getUserRole,
  cancelDEPLeader,
} from '@net/corporate-directory';
import UserInfoColumn from './table-column/user-info-column';
import OtherColumn from './table-column/other-column';

enum ResetStart {
  single = 0,
  batch = 1
}

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

export default function PersonInfo({
  departmentId,
  departmentName,
  keyword,
  handleClear,
}: PersonInfoProps) {
  console.log('ResetStart', ResetStart);
  const [visibleFile, setVisibleFile] = useState<boolean>(false);
  const [resetModal, setResetModal] = useState<boolean>(false);
  const [handleModal, setHandleModal] = useState<boolean>(false);
  const [visibleAdjust, setVisibleAdjust] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<UserStatus>(1);
  const [resetStart, setResetStart] = useState<ResetStart>(0);
  const [visibleStaff, setVisibleStaff] = useState<boolean>(false);
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
      onclick: (params: any) => handleAccount(UserStatus.disable, params),
    };
    const deleted = {
      id: '5',
      iconName: 'trash',
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
      iconName: 'stop',
      text: '启用账号',
      onclick: (params: any) => handleAccount(UserStatus.normal, params),
    };

    if (status === UserStatus.normal) {
      acts = [leader, password, edit, disable, deleted];
    }

    if (status === UserStatus.disable) {
      acts = [open, deleted];
    }

    if (isLeader === UserStatus.normal && status !== UserStatus.disable) {
      acts[0] = cancel;
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

  // 打开文件模态框
  const importFile = () => {
    setVisibleFile(true);
  };

  // 关闭文件模态框
  const closeFileModal = () => {
    setVisibleFile(false);
    refetch();
  };

  const closeStaffModal = () => {
    setVisibleStaff(!visibleStaff);
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
      {
        visibleStaff && <StaffModal
          user={currUser}
          closeModal={closeStaffModal}
        />
      }
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
                icon={<SvgIcon name="device_hub" type="light" size={20} />}
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
