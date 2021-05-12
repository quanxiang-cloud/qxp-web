import React from 'react';

import Icon from '@c/icon';
import { MenuItem } from '@c/more-menu';

import UserCell from './table-column/user-cell';
import { UserStatus, LeaderStatus } from './type';

export const EmployeesColumns = [
  {
    Header: '姓名',
    id: 'userName',
    fixed: true,
    width: 120,
    accessor: (record: Employee) => {
      return (<UserCell user={record} />);
    },
  },
  {
    Header: '手机号',
    id: 'phone',
    accessor: 'phone',
  },
  {
    Header: '邮箱',
    id: 'email',
    accessor: 'email',
  },
  {
    Header: '部门',
    id: 'dep',
    accessor: ({ dep }: Employee) => {
      return dep?.departmentName;
    },
  },
];

export type AuthorMenuItem = {
  authority: number[];
  leader: number[];
} & MenuItem;

export const EmployeesActions: AuthorMenuItem[] = [
  {
    key: 'edit',
    label: (
      <div className="flex items-center">
        <Icon name="create" size={16} className="mr-8" />
        <span className="font-normal">修改员工信息</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
  {
    key: 'confer',
    label: (
      <div className="flex items-center">
        <Icon name="bookmark_border" size={16} className="mr-8" />
        <span className="font-normal">设为主管</span>
      </div>
    ),
    authority: [UserStatus.normal],
    leader: [LeaderStatus.false],
  },
  {
    key: 'revoke',
    label: (
      <div className="flex items-center">
        <Icon name="cancel" size={16} className="mr-8" />
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
        <Icon name="password" size={16} className="mr-8" />
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
        <Icon name="toggle_off" size={16} className="mr-8" />
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
        <Icon name="toggle_on" size={16} className="mr-8" />
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
        <Icon name="restore_from_trash" size={16} className="mr-8" />
        <span className="font-normal">删除账号</span>
      </div>
    ),
    authority: [UserStatus.normal, UserStatus.disable],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
];

export const ExpandActions: MenuItem[] = [
  {
    key: 'export',
    label: (
      <div className="flex items-center">
        <Icon name="exit_to_app" size={16} className="mr-8" />
        <span className="font-normal">导出员工数据</span>
      </div>
    ),
  },
];
