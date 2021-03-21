import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Table, Icon, Message } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Button2 from '@c/button2';
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
import {
  getUserAdminInfo,
  updateUserStatus,
  addDepUser,
  updateUser,
  resetUserPWD,
  setDEPLeader,
  batchAdjustDep,
  getUserRole,
} from './api';
import { excelHeader, exportDepExcel } from './excel';
import { uuid } from '@assets/lib/utils';
import { Dot } from '@portal/components/dot';

export interface IUserInfo {
  id: string;
  userName: string;
  [propsName: string]: any;
}

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
}

export const PersonInfo = React.memo(({
  departmentId,
  departmentName,
  keyword,
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

  const staffMutation = useMutation(
    userModalStatus === 'add' ? addDepUser : updateUser,
    {
      onSuccess: () => {
        setVisibleStaff(false);
        refetch();
      },
    }
  );

  const [currUser, setCurrUser] = useState<IUserInfo>({ id: '', userName: '' });
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

  const handleMutation = useMutation(updateUserStatus, {
    onSuccess: () => {
      setHandleModal(false);
      refetch();
    },
  });

  const superMutation = useMutation(setDEPLeader, {
    onSuccess: () => {
      refetch();
    },
  });

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: (data) => {
      console.log(data);
      if (data && data.code === 0) {
        Message.success('操作成功！');
      } else {
        Message.error('操作失败！');
      }
      setSelectedRows([]);
      setResetModal(false);
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

  const actions = (status: UserStatus) => {
    const acts = [
      {
        id: '1',
        iconName: 'client',
        text: '设为主管 ',
        onclick: (params: any) => setUpSuper(params),
      },
      {
        id: '2',
        iconName: 'key',
        text: '发送随机密码',
        onclick: (params: any) => handleReset(params),
      },
      {
        id: '3',
        iconName: 'pen',
        text: '修改信息 ',
        onclick: (params: any) => handleUserInfo(params, 'edit'),
      },
      {
        id: '4',
        iconName: 'stop',
        text: '禁用账号',
        onclick: (params: any) => handleAccount(-2, params),
      },
      {
        id: '5',
        iconName: 'trash',
        text: '删除账号 ',
        onclick: (params: any) => handleAccount(-1, params),
      },
    ];

    const disable = {
      id: '4',
      iconName: 'stop',
      text: '启用账号',
      onclick: (params: any) => handleAccount(1, params),
    };

    if (status === -2) {
      acts[acts.length - 2] = disable;
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
      limit,
    });
  };

  const imgBgColors: string[] = ['#6366F1', '#F59E0B', '#10B981', '#F97316',
    '#A855F7', '#14B8A6', '#EF4444', '#06B6D4'];

  const getImgColor = (text: string, colors = imgBgColors) => {
    const num: number = text.charCodeAt(0) % 8;
    return colors[num];
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
            <div className="pr-dot-4">
              <div className="relative w-2-dot-4 h-2-dot-4 rounded-br-dot-4 rounded-l-dot-4
              text-center leading-2-dot-4 text-white text-1-dot-4"
              style={{
                backgroundColor: bgColor,
              }}
              >
                {head}
                <div className="w-4 h-4 bg-white rounded-lg flex items-center
                justify-center absolute bottom-dot-5 right-dot-5">
                  {record.useStatus === 1 && (
                    <div className="w-dot-6 h-dot-6 bg-green-first rounded-dot-6"></div>
                  )}
                  {record.useStatus === -2 && (
                    <div className="w-dot-6 h-dot-6 bg-red-600 rounded-dot-6"></div>
                  )}
                </div>
              </div>
            </div>

            {record.useStatus === -2 ?
              <span className="mr-dot-1 text-dark-four">{text}</span> :
              <span className="mr-dot-1">{text}</span>}
            {record.isDEPLeader === 1 && (
              <span
                className={twCascade(
                  'w-3-dot-4 h-1-dot-6 bg-jb rounded-dot-4 p-dot-4',
                  'flex items-center justify-center'
                )}
              >
                <span className="text-white text-1-dot-2">主管</span>
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
          <span className="mr-dot-1 text-dark-four">{text}</span>:
          <span className="mr-dot-1">{text}</span>);
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      // width: 150,
      render: (text: string, record: IUserInfo) => {
        return (record.useStatus === -2 ?
          <span className="mr-dot-1 text-dark-four">{text}</span>:
          <span className="mr-dot-1">{text}</span>
        );
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      render: (text: string, record: IUserInfo) => {
        return (
          record.useStatus === -2 ?
            <span className="mr-dot-1 text-dark-four">{record.dep && record.dep.departmentName}</span>:
            <span className="mr-dot-1 ">{record.dep && record.dep.departmentName}</span>
        );
      }
      ,
    },
    {
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: any, record?: IUserInfo) => {
        return (
          <More<IUserInfo>
            items={actions(record && record.useStatus)}
            params={record}
            contentClassName="mr-8"
          />
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
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
      console.log(res);
      if (res && res.data) {
        const { data } = res;
        const newData = data.map((user) => {
          user.depName = user.dep && user.dep.departmentName;
          return user;
        });
        console.log(newData);
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
        <div className="flex items-stretch px-4">
          {selectedRows.length > 0 ? (
            <>
              <Button
                className="bg-black"
                textClassName="text-white"
                icon={
                  <svg
                    className="mr-dot-4"
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
              <div className="px-2"></div>
              <Button
                icon={<Icon className="mr-dot-4" name="add" />}
                onClick={openSendPwd}
              >
                发送随机密码
              </Button>
            </>
          ) : (
            <>
              <Button2 isPrimary icon="folder" onClick={importFile} className="mr-16px">
                excel 批量导入
              </Button2>
              <Button2
                icon="add"
                onClick={() => handleUserInfo({ id: '', userName: '' }, 'add')}
                className="mr-16px"
              >
                添加员工
              </Button2>
              <div className="px-2"></div>
              <More
                items={[<List key={uuid()} items={expandActions} />]}
                contentClassName="mr-8"
              >
                <Button className="light-button w-3-dot-2 h-dot-2 relative
                -top-2px" textClassName="text-white">
                  <div className="flex-start-center">
                    <Dot />
                    <Dot />
                    <Dot />
                  </div>
                </Button>
              </More>
            </>
          )}
        </div>
        <div className="w-full mt-dot-8 flex-column overflow-y-a flex-1 px-4">
          <div className="qxp-table flex w-full">
            <Table
              className="text-1-dot-4 table-full"
              dataSource={personList?.data || []}
              columns={columns}
              rowKey="id"
              rowSelection={rowSelection}
              emptyText={<EmptyData text="无成员数据" className="py-10" />}
              loading={isLoading}
            />
          </div>
          <div className="flex justify-end">
            <Pagination
              type="simple"
              current={pageParams.page}
              total={personList?.total || 0}
              pageSize={pageParams.limit}
              pageSizeOptions={pageSizeOptions}
              onChange={handleChange}
              onShowSizeChange={handleShowSizeChange}
            />
          </div>
        </div>
      </div>
    </>
  );
});
