import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { GridTable, Dropdown, Loading } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { ActionsList, IActionListItem } from '@portal/components/ActionsList';
import { Pagination } from '@portal/components/Pagination';
import { ResetPasswordModal } from './ResetPasswordModal';
import { AccountHandleModal } from './AccountHandleModal';
import { StaffModal } from './StaffModal';

import { getUserAdminInfo, delDepUser, updateUserStatus } from './api';

export interface IUserInfo {
  id: string;
  userName: string;
  [propsName: string]: any;
}
interface PersonInfoProps {
  departmentId: string;
}

export const PersonInfo = (props: PersonInfoProps) => {
  const { departmentId } = props;
  const [resetModal, setResetModal] = useState(false);
  const [handleModal, setHandleModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<'disabled' | 'delete'>('disabled');
  const [visibleStaff, setVisibleStaff] = useState(false);

  const closeStaffModal = () => {
    setVisibleStaff(!visibleStaff);
  };

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

  const delMutation = useMutation(delDepUser, {
    onSuccess: () => {
      setHandleModal(false);
      refetch();
    },
  });

  const disMutation = useMutation(updateUserStatus, {
    onSuccess: () => {
      setHandleModal(false);
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    );
  }
  const pageSizeOptions = [10, 20, 50, 100];

  // const [pageParams, setPageParams] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 108,
  // });

  const actions: IActionListItem<{
    id: string;
    iconName: string;
    text: string;
  }>[] = [
    {
      id: '1',
      iconName: './dist/images/set-leader.svg',
      text: '设为主管 ',
    },
    {
      id: '2',
      iconName: './dist/images/reset-pwd.svg',
      text: '重置密码',
      onclick: (params: any) => handleReset(params),
    },
    {
      id: '3',
      iconName: './dist/images/del.svg',
      text: '修改信息 ',
      onclick: closeStaffModal,
    },
    {
      id: '4',
      iconName: './dist/images/disable-user.svg',
      text: '禁用账号',
      onclick: (params: any) => handleAccount('disabled', params),
    },
    {
      id: '5',
      iconName: './dist/images/del.svg',
      text: '删除账号 ',
      onclick: (params: any) => handleAccount('delete', params),
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      width: 100,
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
    // {
    //   title: '角色',
    //   dataIndex: 'role',
    //   width: 130,
    //   render: (text: any) => {
    //     return (
    //       <div
    //         className={twCascade(
    //           'text-center text-375FF3 leading-1-dot-6 border-none inline-block px-dot-8',
    //           'py-dot-125 rounded-l-dot-4 rounded-tr-dot-1 rounded-br-dot-4 bg-DEE9FF',
    //         )}
    //       >
    //         {text}
    //       </div>
    //     );
    //   },
    // },
    {
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: any, record?: IUserInfo | Partial<IUserInfo>) => {
        return (
          <Dropdown content={<ActionsList<IUserInfo> actions={actions} params={record} />}>
            <div className="cursor-pointer">···</div>
          </Dropdown>
        );
      },
    },
  ];

  // 重置密码
  const handleReset = (params: IUserInfo) => {
    setCurrUser(params);
    setResetModal(true);
  };

  // 关闭-重置密码弹窗
  const closeResetModal = () => {
    setResetModal(false);
  };

  // 处理账号
  const handleAccount = (status: 'disabled' | 'delete', params: IUserInfo): void => {
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
    if (modalStatus === 'delete') {
      delMutation.mutate(currUser.id);
    } else {
      disMutation.mutate({ id: currUser.id, status: -2 });
    }
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

  return (
    <>
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
          okModal={closeResetModal}
        />
      )}
      <div className="w-full mt-dot-8">
        <GridTable
          className="text-dot-7"
          dataSource={personList?.data}
          columns={columns}
          rowKey="id"
          selectType="checkbox"
          // selectedRowKeys={selectedRowKeys}
          // disabledRowKeys={this.disabledRowKeys}
          // onSelect={this.onSelect}
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
    </>
  );
};
