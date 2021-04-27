import React, { useState, useMemo } from 'react';

import Icon from '@c/icon';
import Drawer from '@c/drawer';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

import RightSetting from './rights-setting';
import store from '../store';
import './index.scss';

type Props = {
  rights: Rights;
  actions: (key: string, rights: Rights) => void
}

function RightsItem({ rights, actions }: Props) {
  const [modalType, setModalType] = useState('');
  const userAndDept = useMemo(() => {
    if (rights.scopes && rights.scopes.length) {
      const users:any = [];
      const deptList:any = [];
      rights.scopes.forEach((scope)=>{
        if (scope.type===1) {
          users.push({
            ownerID: scope.id,
            type: 1,
            ownerName: scope.name,
          });
        } else {
          deptList.push({
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

  const handleAdd = (deptList: any[], employees: any[]) => {
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
    return store.updatePerGroup({ id: rights.id, scopes });
  };

  return (
    <div className='pb-form-right-item rights-group-block' data-id={rights.id}>
      <div className='pb-form-right-title'>
        <span className='text-h5 mr-8'>{rights.name}</span>
        <span className='text-caption-no-color text-gray-600'>{rights.description}</span>
        <span className='text-caption-no-color bg-red-50 text-red-600 mx-8 px-6'>
          优先级：{rights.sequence}
        </span>
        <p className='pb-form-right-action flex gap-x-16'>
          <Icon className='cursor-grab rights-group-handle' name='drag_indicator' />
          <span onClick={() => setModalType('setting')}>修改</span>
          <span className='text-red-400' onClick={() => actions('del', rights)}>删除</span>
        </p>
      </div>
      <div className='p-20'>
        <div className='mb-4'>
          <div onClick={() => setModalType('addUser')} className='text-icon-btn py-4 px-8'>
            <Icon name='add' />
            添加员工与部门
          </div>
        </div>
        <div className='flex gap-8 flex-wrap'>
          {(rights.scopes || []).map(({ name, type }: any) => (
            <p className={`pb-form-right-${type === 1 ? 'user' : 'dep'}`} key={name}>
              <span>
                <Icon
                  type='light'
                  name={type === 1 ? 'person' : 'device_hub'}
                />
              </span>
              {name}
            </p>
          ))}
        </div>
      </div>
      {modalType === 'setting' && (
        <Drawer title='编辑权限组' onCancel={() => setModalType('')}>
          <RightSetting rights={rights} />
        </Drawer>
      )}
      {modalType === 'addUser' && (
        <EmployeeOrDepartmentPickerModal
          title='添加部门与员工'
          submitText='提交'
          employees={userAndDept.users}
          departments={userAndDept.deptList}
          onSubmit={handleAdd}
          onCancel={() => setModalType('')}
        />
      )}
    </div>
  );
}

export default RightsItem;
