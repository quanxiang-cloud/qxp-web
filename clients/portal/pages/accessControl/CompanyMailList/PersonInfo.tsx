import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Table, Dropdown, Icon } from '@QCFE/lego-ui';

import { ActionsList, IActionListItem } from '@portal/components/ActionsList';
import { Pagination } from '@portal/components/Pagination';
import { ResetPasswordModal, CheckedWay } from './ResetPasswordModal';
import { AccountHandleModal } from './AccountHandleModal';
import { StaffModal, FormValues } from './StaffModal';
import { Loading } from '@portal/components/Loading';
import { DepartmentStaff } from '@portal/components/DepartmentStaff';
import { Button } from '@portal/components/Button';
import { ExportFileModal } from './ExportFileModal';
import { getUserAdminInfo, updateUserStatus, addDepUser, resetUserPWD } from './api';

export interface IUserInfo {
  id: string;
  userName: string;
  [propsName: string]: any;
}

export type UserStatus = 1 | -1 | -2; // 1 正常 -2 禁用 -1 删除
type ResetStart = 0 | 1; // 0是单个，1批量

interface PersonInfoProps {
  departmentId: string;
}

export const PersonInfo = (props: PersonInfoProps) => {
  const { departmentId } = props;
  const [visibleFile, setVisibleFile] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [handleModal, setHandleModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<UserStatus>(1);
  const [resetStart, setResetStart] = useState<ResetStart>(0);
  const [visibleStaff, setVisibleStaff] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const mutation = useMutation(addDepUser, {
    onSuccess: () => {
      setVisibleStaff(false);
      refetch();
    },
  });

  const [currUser, setCurrUser] = useState<IUserInfo>({ id: '', userName: '' });
  const [pageParams, setPageParams] = React.useState<{
    page: number;
    limit: number;
    total: number;
  }>({
    page: 1,
    limit: 10,
    total: 10,
  });

  const { data: personList, isLoading, refetch } = useQuery(
    ['getUserAdminInfo', pageParams, departmentId],
    () => getUserAdminInfo(departmentId, pageParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleMutation = useMutation(updateUserStatus, {
    onSuccess: () => {
      setHandleModal(false);
      refetch();
    },
  });

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: (data) => {
      console.log(data);
      if (data && data.code === 0) {
        setResetModal(false);
      }
    },
  });

  const pageSizeOptions = [10, 20, 50, 100];

  // const [pageParams, setPageParams] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 108,
  // });

  const actions = (status: UserStatus) => {
    const acts: IActionListItem<{
      id: string;
      iconName: string;
      text: string;
      onclick?: () => void;
    }>[] = [
      {
        id: '1',
        iconName: 'client',
        text: '设为主管 ',
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
        onclick: closeStaffModal,
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
      iconName: './dist/images/add-department.svg',
      text: '启用账号',
      onclick: (params: any) => handleAccount(1, params),
    };

    if (status === -2) {
      acts[acts.length - 2] = disable;
    }

    return acts;
  };

  // dan
  const handleReset = (params: IUserInfo) => {
    setResetStart(0);
    setCurrUser(params);
    setResetModal(true);
  };

  const openSendPwd = () => {
    setResetStart(1);
    setResetModal(true);
  };

  // 关闭-重置密码弹窗
  const closeResetModal = () => {
    setResetModal(false);
  };

  // 处理账号
  const handleAccount = (status: UserStatus, params: IUserInfo): void => {
    setCurrUser(params);
    setModalStatus(status);
    setHandleModal(true);
  };

  // 关闭-处理账号弹窗
  const closeHandleModal = () => {
    setHandleModal(false);
  };

  // 确定
  const okHandleModal = () => {
    handleMutation.mutate({ id: currUser.id, status: modalStatus });
  };

  // 处理页码
  const handleChange = (current: number) => {
    // setPageParams({
    //   current
    //   pageSize: pageParams.pageSize,
    //   total: pageParams.total,
    // });
  };

  // 处理页数量
  const handleShowSizeChange = (pageSize: number) => {
    // setPageParams({
    //   current: 1,
    //   pageSize,
    //   total: pageParams.total,
    // });
  };

  const handleStatus = (status: UserStatus) => {
    let text = '';
    switch (status) {
      case -1:
        text = '删除';
        break;
      case -2:
        text = '禁用';
        break;
      default:
        text = '正常';
        break;
    }
    return text;
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      width: 100,
      render: (text: string, render: IUserInfo) => {
        return (
          <div>
            {handleStatus(render.useStatus)}-{text}
          </div>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      // width: 150,
    },
    {
      title: '部门',
      dataIndex: 'department',
      render: (text: string, render: IUserInfo) => {
        return render.dep && render.dep.departmentName;
      },
    },
    {
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: any, record?: IUserInfo | Partial<IUserInfo>) => {
        return (
          <Dropdown
            content={
              <ActionsList<IUserInfo>
                actions={actions(record && record.useStatus)}
                params={record}
              />
            }
          >
            <div className="cursor-pointer">···</div>
          </Dropdown>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: string[], selectedRows: IUserInfo[]) => {
      setSelectedRows(selectedRowKeys);
      console.log('selectedRowKeys:', selectedRowKeys, 'selectedRows: ', selectedRows);
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

  const okStaffModal = (values: FormValues) => {
    mutation.mutate(values);
  };

  // 新增员工
  const openStaffModal = () => {
    setVisibleStaff(true);
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

  const actionss: IActionListItem<null>[] = [
    {
      id: '1',
      iconName: 'export-data.svg',
      text: '导出员工数据 ',
    },
  ];

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <>
      {/* 员工模态框 */}
      {visibleStaff && (
        <StaffModal
          visible={visibleStaff}
          status="add"
          okModal={okStaffModal}
          closeModal={closeStaffModal}
        />
      )}
      {/* 文件处理模态框 */}
      {visibleFile && (
        <ExportFileModal
          visible={visibleFile}
          currDepId={departmentId}
          closeModal={closeFileModal}
          okModal={okExportModal}
        />
      )}
      {/* 员工模态框 */}
      {visibleStaff && (
        <StaffModal
          visible={visibleStaff}
          status="edit"
          okModal={closeStaffModal}
          closeModal={closeStaffModal}
        />
      )}
      {handleModal && (
        <AccountHandleModal
          visible={handleModal}
          status={modalStatus}
          initData={currUser}
          closeModal={closeHandleModal}
          okModal={okHandleModal}
        />
      )}
      {resetModal && (
        <ResetPasswordModal
          visible={resetModal}
          closeModal={closeResetModal}
          okModal={okResetModal}
        />
      )}
      <div className="flex-1 h-full">
        <DepartmentStaff department="全象应用平台" count={personList?.total || 0} unit="人" />
        <div className="px-4 my-2">
          <div className="flex items-center">
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
                        d="M15.6667 1.99998H9.00008L7.33342 0.333313H2.33341C1.40841 0.333313 0.675081 1.07498 0.675081 1.99998L0.666748 12C0.666748 12.925 1.40841 13.6666 2.33341 13.6666H15.6667C16.5917 13.6666 17.3334 12.925 17.3334 12V3.66665C17.3334 2.74165 16.5917 1.99998 15.6667 1.99998ZM15.6667 12H2.33341V1.99998H6.64175L8.30841 3.66665H15.6667V12ZM9.00008 8.66665H10.6667V10.3333H12.3334V8.66665H14.0001V6.99998H12.3334V5.33331H10.6667V6.99998H9.00008V8.66665Z"
                        fill="white"
                      />
                    </svg>
                  }
                  onClick={importFile}
                >
                  调整部门
                </Button>
                <div className="px-2"></div>
                <Button icon={<Icon className="mr-dot-4" name="add" />} onClick={openSendPwd}>
                  发送随机密码
                </Button>
              </>
            ) : (
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
                        d="M15.6667 1.99998H9.00008L7.33342 0.333313H2.33341C1.40841 0.333313 0.675081 1.07498 0.675081 1.99998L0.666748 12C0.666748 12.925 1.40841 13.6666 2.33341 13.6666H15.6667C16.5917 13.6666 17.3334 12.925 17.3334 12V3.66665C17.3334 2.74165 16.5917 1.99998 15.6667 1.99998ZM15.6667 12H2.33341V1.99998H6.64175L8.30841 3.66665H15.6667V12ZM9.00008 8.66665H10.6667V10.3333H12.3334V8.66665H14.0001V6.99998H12.3334V5.33331H10.6667V6.99998H9.00008V8.66665Z"
                        fill="white"
                      />
                    </svg>
                  }
                  onClick={importFile}
                >
                  excel 批量导入
                </Button>
                <div className="px-2"></div>
                <Button icon={<Icon className="mr-dot-4" name="add" />} onClick={openStaffModal}>
                  添加员工
                </Button>
              </>
            )}

            <div className="px-2"></div>
            {/* <Dropdown content={<ActionsList actions={actions} />}>
                  <div>
                    <Button className="bg-black" textClassName="text-white">
                      ···
                    </Button>
                  </div>
                </Dropdown> */}
          </div>
          <div className="w-full mt-dot-8">
            <Table
              className="text-dot-7"
              dataSource={personList?.data}
              columns={columns}
              rowKey="id"
              rowSelection={rowSelection}
            />
            <div className="flex items-center justify-between">
              {/* <ul className="flex items-center">
            <li className="flex items-center">
              <img src="./dist/images/active.svg" className="pr-dot-4" alt="" />
              <div className="text-dot-7">活跃中：2</div>
            </li>
            <li className="flex items-center">
              <img
                className="w-1-dot-2 h-1-dot-2 pr-dot-4"
                src="./dist/images/disabled.svg"
                alt=""
              />
              <div className="text-dot-7">已禁用：1</div>
            </li>
          </ul> */}
              <Pagination
                current={1}
                total={1 || personList?.total}
                pageSize={5}
                pageSizeOptions={pageSizeOptions}
                onChange={handleChange}
                onShowSizeChange={handleShowSizeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
