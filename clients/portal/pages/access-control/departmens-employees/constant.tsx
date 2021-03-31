import React from 'react';

import SvgIcon from '@c/icon';
import UserCell from './table-column/user-cell';
import OtherCell from './table-column/other-cell';
import { MenuItem } from '@c/more-menu';
import { UserInfo } from '@portal/api/auth';

import { UserStatus, LeaderStatus } from './enum';

export const EmployeesColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    render: (text: string, record: UserInfo) => <UserCell userinfo={record} />,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 130,
    render: (text: string, record: UserInfo) => {
      return <OtherCell columnKey='phone' userinfo={record} />;
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    // width: 150,
    render: (text: string, record: UserInfo) => {
      return <OtherCell columnKey='email' userinfo={record} />;
    },
  },
  {
    title: '部门',
    dataIndex: 'department',
    render: (text: string, record: UserInfo) => {
      return <OtherCell columnKey='dep' userinfo={record} />;
    },
  },
];

export type AuthorMenuItem<T> = {
  authority: number[];
  leader: number[];
} & MenuItem<T>;

export const EmplayeesActions: AuthorMenuItem<string>[] = [
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

export const ExpandActions: MenuItem<string>[] = [
  {
    key: 'export',
    label: (
      <div className="flex items-center">
        <SvgIcon name="more_horiz" size={16} className="mr-8" />
        <span className="font-normal">导出员工数据</span>
      </div>
    ),
  },
];
