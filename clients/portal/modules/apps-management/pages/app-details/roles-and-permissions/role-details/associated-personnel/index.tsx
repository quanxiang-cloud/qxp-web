import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';

import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

import store from '../store';
import ScopeTable from './scope-table';
import AssociatedToolbar from './toolbar';
import { SCOPE } from '../../constants';

function AssociatedPerson(): JSX.Element {
  const { appID, currentRoleID } = store;

  useEffect(() => {
    appID && currentRoleID && store.fetchRolePerson(appID, currentRoleID);
  }, [currentRoleID, appID]);

  const userAndDept = useMemo(() => {
    if (store.currentScopes.length) {
      const users: UserOrDept[] = [];
      const deptList: UserOrDept[] = [];
      store.currentScopes.forEach((scope) => {
        if (scope.type === SCOPE.STAFF) {
          users.push({
            id: scope.id,
            ownerID: scope.id,
            type: SCOPE.STAFF,
            ownerName: scope.name,
          });
        } else {
          deptList.push({
            id: scope.id,
            ownerID: scope.id,
            type: SCOPE.DEP,
            ownerName: scope.name,
          });
        }
      });
      return { users, deptList };
    }
    return { users: [], deptList: [] };
  }, [store.currentScopes]);

  const handleAdd = (
    deptList: EmployeeOrDepartmentOfRole[], employees: EmployeeOrDepartmentOfRole[],
  ): Promise<void> => {
    return store.batchUpdatePerUser(deptList, employees);
  };

  return (
    <>
      <div className='h-full flex flex-col'>
        <AssociatedToolbar/>
        <ScopeTable
          users={userAndDept.users}
          deptList={userAndDept.deptList}
        />
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
