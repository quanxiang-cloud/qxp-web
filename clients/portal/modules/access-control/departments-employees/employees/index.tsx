import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import EmployeesHeader from './employees-header';
import PageTable from './pageTable';
import EmployeeModal from './modal';
import useSearchEmployees from '../hooks/useSearchEmployees';
import store from './store';

type Props = {
  department: Department;
};

function Employees({ department }: Props): JSX.Element {
  const { employeesList, isLoading, refetch } = useSearchEmployees({
    departmentID: department.id,
    ...store.filterUserInfo,
    page: store.page,
    size: store.pageSize,
  });

  useEffect(() => {
    store.setEmployeesList(employeesList);
    store.setLoading(isLoading);
  }, [employeesList, isLoading]);

  return (
    <div className="h-full flex flex-col flex-1 pt-16 overflow-hidden">
      <EmployeesHeader />
      <PageTable />
      <EmployeeModal />
    </div>
  );
}

export default observer(Employees);
