import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';

import toast from '@lib/toast';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

import store from './store';
import UserAndPerStore from '../store';
import ScopeTable from './scope-table';
import AssociatedToolbar from './toolbar';
import { SCOPE } from '../constants';

function AssociatedPerson(): JSX.Element {
  const { appID, currentRoleID } = UserAndPerStore;

  useEffect(() => {
    appID && currentRoleID && store.fetchRolePerson(appID, currentRoleID);
  }, [currentRoleID, appID]);

  const userAndDept = useMemo(() => {
    if (store.currentScopes && store.currentScopes.length) {
      const users: UserOrDept[] = [];
      const deptList: UserOrDept[] = [];
      store.currentScopes.forEach((scope) => {
        if (scope.type === SCOPE.STAFF) {
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
      const usersIDList = Array.from(users, ({ id }) => id);
      store.fetchUserDetailList(usersIDList);
      store.setScopeDeptList(deptList);
      return { users, deptList };
    }
    store.UserDetailList = [];
    return { users: [], deptList: [] };
  }, [store.currentScopes]);

  const handleAdd = (
    deptList: EmployeeOrDepartmentOfRole[], employees: EmployeeOrDepartmentOfRole[],
  ): Promise<void> => {
    return store.batchUpdatePerUser(deptList, employees)
      .then(() => toast.success('修改成功'))
      .catch(() => toast.error('修改失败'))
      .finally(() => store.setShowPickerModal(false));
  };

  return (
    <>
      <div className='h-full flex flex-col'>
        <AssociatedToolbar/>
        <ScopeTable/>
      </div>
      {store.showPickerModal && (
        <EmployeeOrDepartmentPickerModal
          title='添加部门与员工'
          submitText='提交'
          employees={userAndDept.users as EmployeeOrDepartmentOfRole[]}
          departments={userAndDept.deptList as EmployeeOrDepartmentOfRole[]}
          onSubmit={handleAdd}
          onCancel={() => store.setShowPickerModal(false)}
        />
      )}
    </>
  );
}

export default observer(AssociatedPerson);
