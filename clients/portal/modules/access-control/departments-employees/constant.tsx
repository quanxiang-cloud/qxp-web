import React from 'react';

import Icon from '@c/icon';
import { MenuItem } from '@c/more-menu';

import { UserStatus, LeaderStatus } from './type';
import { ModalType } from './modal';

export const userGraphQL = '{users{id,phone,position,email,name,useStatus,departments{id,name,attr},leaders{id,name,attr}},total}';

export const initUserInfo = { id: '', name: '', email: '', phone: '', selfEamil: '' };

export type AuthorMenuItem = {
  authority: number[];
  leader: number[];
} & MenuItem;

export const EmployeesActions: AuthorMenuItem[] = [
  {
    key: 'show-info',
    label: (
      <div className="flex items-center">
        <Icon name="remove_red_eye" size={16} className="mr-8" />
        <span className="font-normal">查看员工详情</span>
      </div>
    ),
    authority: [UserStatus.normal, UserStatus.disable],
    leader: [LeaderStatus.true, LeaderStatus.false],
  },
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

export const KeyToModalTypeMap: { [key: string]: ModalType } = {
  'show-info': 'show_employees',
  edit: 'edit_employees',
  confer: 'leader_handle',
  revoke: 'leader_handle',
  reset: 'reset_password',
  disable: 'user_state_disabled',
  enable: 'user_state_normal',
  delete: 'user_state_delete',
};

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
