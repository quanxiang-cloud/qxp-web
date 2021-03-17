import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { GridTable, Dropdown } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { ActionsList, IActionListItem } from '@portal/components/ActionsList';
import { Pagination } from '@portal/components/Pagination';
import { ResetPasswordModal } from './ResetPasswordModal';
import { AccountHandleModal } from './AccountHandleModal';
import { StaffModal } from './StaffModal';

import { getAdminDEPList } from './api';

const dataSource: any[] = [
  {
    name: '郭LILI',
    phone: '17617562233',
    email: 'Jackson@qxp.com',
    department: '运维一部',
    role: '普通管理员',
  },
  {
    name: '郭LILI2',
    phone: '17617562233',
    email: 'Jackson@qxp.com',
    department: '运维一部',
    role: '普通管理员',
  },
  {
    name: '郭LILI3',
    phone: '17617562233',
    email: 'Jackson@qxp.com',
    department: '运维一部',
    role: '普通管理员',
  },
];

interface PersonInfoProps {
  departmentId: string;
}

export const PersonInfo = (props: PersonInfoProps) => {
  const { departmentId } = props;

  // const { data, isLoading } = useQuery('getAdminDEPList', () => getAdminDEPList(departmentId), {
  //   // enable
  // })
  const pageSizeOptions = [10, 20, 50, 100];

  const [resetModal, setResetModal] = useState(false);
  const [handleModal, setHandleModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<'disabled' | 'delete'>('disabled');
  const [visibleStaff, setVisibleStaff] = useState(false);
  const [pageParams, setPageParams] = useState({
    current: 1,
    pageSize: 10,
    total: 108,
  });

  const closeStaffModal = () => {
    setVisibleStaff(!visibleStaff);
  };

  const actions: IActionListItem<null>[] = [
    {
      id: '1',
      iconName: './dist/images/add-department.svg',
      text: '设为主管 ',
    },
    {
      id: '2',
      iconName: './dist/images/add-department.svg',
      text: '重置密码',
      onclick: (params: any) => handleReset(params),
    },
    {
      id: '3',
      iconName: './dist/images/add-department.svg',
      text: '修改信息 ',
      onclick: closeStaffModal,
    },
    {
      id: '4',
      iconName: './dist/images/add-department.svg',
      text: '禁用账号',
      onclick: () => handleAccount('disabled'),
    },
    {
      id: '5',
      iconName: './dist/images/add-department.svg',
      text: '删除账号 ',
      onclick: () => handleAccount('delete'),
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
    },
    {
      title: '部门',
      dataIndex: 'department',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 130,
      render: (text: any) => {
        return (
          <div
            className={twCascade(
              'text-center text-375FF3 leading-1-dot-6 border-none inline-block px-dot-8',
              'py-dot-125 rounded-l-dot-4 rounded-tr-dot-1 rounded-br-dot-4 bg-DEE9FF',
            )}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      width: 40,
      render: (text: any, record: any) => {
        return (
          <Dropdown content={<ActionsList actions={actions} params={record} />}>
            <div className="cursor-pointer">···</div>
          </Dropdown>
        );
      },
    },
  ];

  // 重置密码
  const handleReset = (record: any) => {
    setResetModal(true);
  };

  // 关闭-重置密码弹窗
  const closeResetModal = () => {
    setResetModal(false);
  };

  // 处理账号
  const handleAccount = (status: 'disabled' | 'delete') => {
    setModalStatus(status);
    setHandleModal(true);
  };

  // 关闭-处理账号弹窗
  const closeHandleModal = () => {
    setHandleModal(false);
  };

  // 处理页码
  const handleChange = (current: number) => {
    setPageParams({
      current,
      pageSize: pageParams.pageSize,
      total: pageParams.total,
    });
  };

  // 处理页数量
  const handleShowSizeChange = (pageSize: number) => {
    setPageParams({
      current: 1,
      pageSize,
      total: pageParams.total,
    });
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
          closeModal={closeHandleModal}
          okModal={closeHandleModal}
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
          dataSource={dataSource}
          columns={columns}
          rowKey="name"
          selectType="checkbox"
          // selectedRowKeys={selectedRowKeys}
          // disabledRowKeys={this.disabledRowKeys}
          // onSelect={this.onSelect}
        />
        <div className="flex items-center justify-between">
          <ul className="flex items-center">
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
          </ul>
          <Pagination
            current={pageParams.current}
            total={pageParams.total}
            pageSize={pageParams.pageSize}
            pageSizeOptions={pageSizeOptions}
            onChange={handleChange}
            onShowSizeChange={handleShowSizeChange}
          />
        </div>
      </div>
    </>
  );
};
