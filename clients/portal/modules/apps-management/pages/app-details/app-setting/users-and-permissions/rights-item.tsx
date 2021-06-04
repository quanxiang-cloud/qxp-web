import React, { useState, useMemo } from 'react';

import Icon from '@c/icon';
import Drawer from '@c/drawer';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

import RightSetting from './rights-setting';
import './index.scss';

type Props = {
  rights: Rights;
  actions: (key: string, rights: Rights) => void | Promise<boolean | void>;
}

type UserOrDept = {
  id: string,
  ownerID: string,
  type: number,
  ownerName: string,
}

function RightsItem({ rights, actions }: Props) {
  const [modalType, setModalType] = useState('');
  const userAndDept = useMemo(() => {
    if (rights.scopes && rights.scopes.length) {
      const users: UserOrDept[] = [];
      const deptList: UserOrDept[] = [];
      rights.scopes.forEach((scope) => {
        if (scope.type === 1) {
          users.push({
            id: scope.id,
            ownerID: scope.id,
            type: 1,
            ownerName: scope.name,
          });
        } else {
          deptList.push({
            id: scope.id,
            ownerID: scope.id,
            type: 2,
            ownerName: scope.name,
          });
        }
      });
      return { users, deptList };
    }

    return { users: [], deptList: [] };
  }, [rights.scopes]);

  const handleAdd = (deptList: EmployeeOrDepartmentOfRole[], employees: EmployeeOrDepartmentOfRole[]) => {
    const scopes: DeptAndUser[] = [];
    deptList.forEach((dept) => {
      scopes.push({
        type: 2,
        id: dept.id,
        name: dept.ownerName,
      });
    });

    employees.forEach((employee) => {
      scopes.push({
        type: 1,
        id: employee.id,
        name: employee.ownerName,
      });
    });

    return actions('addUser', { id: rights.id, scopes }) as Promise<boolean | void>;
  };

  return (
    <div className='pb-form-right-item rights-group-block' data-id={rights.id}>
      <div className='pb-form-right-title'>
        <span className='text-h5 mr-8'>{rights.name}</span>
        <span className='text-caption-no-color text-gray-600'>{rights.description}</span>
        <p className='pb-form-right-action flex gap-x-16'>
          <span onClick={() => setModalType('setting')}>修改</span>
          <span className='text-red-400' onClick={() => actions('del', rights)}>删除</span>
        </p>
      </div>
      {rights.add ? (
        <div className='p-20'>
          <div className='mb-4'>
            <div onClick={() => setModalType('addUser')} className='text-icon-btn py-4 px-8'>
              <Icon name='add' />
            添加员工与部门
            </div>
          </div>
          <div className='flex gap-8 flex-wrap'>
            {(rights.scopes || []).map(({ name, type, id }) => (
              <div className={`pb-form-right-${type === 1 ? 'user' : 'dep'}`} key={id}>
                <span>
                  <Icon
                    type='light'
                    name={type === 1 ? 'person' : 'device_hub'}
                  />
                </span>
                <div title={name} className="truncate">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : <div className='p-20'>该权限组无有效权限</div>}
      {modalType === 'setting' && (
        <Drawer title='编辑权限组' onCancel={() => setModalType('')}>
          <RightSetting rights={rights} />
        </Drawer>
      )}
      {modalType === 'addUser' && (
        <EmployeeOrDepartmentPickerModal
          title='添加部门与员工'
          submitText='提交'
          employees={userAndDept.users as EmployeeOrDepartmentOfRole[]}
          departments={userAndDept.deptList as EmployeeOrDepartmentOfRole[]}
          onSubmit={handleAdd}
          onCancel={() => setModalType('')}
        />
      )}
    </div>
  );
}

export default RightsItem;
