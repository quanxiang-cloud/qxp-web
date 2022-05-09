import React from 'react';

import Modal from '@c/modal';
import { getTwoDimenArrayHead } from '@lib/utils';

interface Props {
  user: Employee;
  closeModal(): void;
}

function EmployeesInfo({ user }: { user: Employee }): JSX.Element {
  const expandProps = [
    { id: '1', label: '扩展属性1', value: 'aaa', isMust: true },
    { id: '2', label: '扩展属性2', value: 'bbb', isMust: false },
  ];
  return (
    <div>
      <h4>基本信息</h4>
      <div>
        <label>员工姓名: </label>
        <span>{user.name}</span>
      </div>
      <div>
        <label>手机号码: </label>
        <span>{user.phone}</span>
      </div>
      <div>
        <label>邮箱: </label>
        <span>{user.email}</span>
      </div>
      <h4>扩展属性</h4>
      <p>动态属性可到【
        <a href='#'>数据字典</a>
      】进行设置并启用</p>
      {expandProps.map(({ id, label, value, isMust }) => (
        <div key={id} className="flex items-center">
          {isMust && <span className="text-red-500">*</span>}
          <label>{ label }: </label>
          <span>{ value }: </span>
        </div>
      ))}
    </div>
  );
}

export default function EmployeesInfoModal({ user, closeModal }: Props): JSX.Element {
  const dep = getTwoDimenArrayHead(user.departments);

  return (
    <Modal
      title="成员详情"
      className='static-modal'
      onClose={closeModal}
      footerBtns={[
        {
          text: '关闭',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
      ]}
    >
      <div className="p-20">
        <h4>姓名：{user.name}</h4>
        <EmployeesInfo user={user} />
      </div>
    </Modal>
  );
}
