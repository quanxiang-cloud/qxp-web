import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

import store from './store';
import ScopeTable from './scope-table';
import AssociatedToolbar from './toolbar';

type Props = {
  curRole: RoleRight
}

function AssociatedPerson({ curRole }: Props): JSX.Element {
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.setAppID(appID);
    return () => {
      store.clear();
    };
  }, []);

  useEffect(() => {
    store.setCurrentRoleID(curRole.id);
  }, [curRole]);

  const handleAdd = (
    deptList: EmployeeOrDepartmentOfRole[], employees: EmployeeOrDepartmentOfRole[],
  ): Promise<void> => {
    return store.batchUpdatePerUser(deptList, employees);
  };

  return (
    <>
      <div className='h-full flex flex-col'>
        <AssociatedToolbar />
        <ScopeTable />
      </div>
      {store.showPickerModal && (
        <EmployeeOrDepartmentPickerModal
          title='添加部门与员工'
          submitText='提交'
          employees={store.userAndDept.users as EmployeeOrDepartmentOfRole[]}
          departments={store.userAndDept.deptList as EmployeeOrDepartmentOfRole[]}
          onSubmit={handleAdd}
          onCancel={() => store.setShowPickerModal(false)}
        />
      )}
    </>
  );
}

export default observer(AssociatedPerson);
