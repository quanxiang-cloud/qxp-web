import { SCOPE } from './constants';

type getAddAndRemovePersonResult = {
  newScopes: DeptAndUser[],
  addAndRemoveScope: {
    add: DeptAndUser[],
    removes: string[]
  }
}

export function getAddAndRemovePerson(
  oldScopes: DeptAndUser[],
  deptList: EmployeeOrDepartmentOfRole[],
  employees: EmployeeOrDepartmentOfRole[]): getAddAndRemovePersonResult {
  const newScopes: DeptAndUser[] = [];
  deptList.forEach((dept) => {
    newScopes.push({
      type: SCOPE.DEP,
      id: dept.id,
      name: dept.ownerName,
    });
  });

  employees.forEach((employee) => {
    newScopes.push({
      type: SCOPE.STAFF,
      id: employee.id,
      name: employee.ownerName,
    });
  });
  const checkedId = newScopes && newScopes.map((item: DeptAndUser) => item.id);
  const removeList: DeptAndUser[] = oldScopes.filter((item: DeptAndUser) => !checkedId.includes(item.id));

  const removeIDList = removeList.map((remove) => {
    return remove.id;
  });

  const checkedId2 = oldScopes && oldScopes.map((item: DeptAndUser) => item.id);

  const addList: DeptAndUser[] = newScopes.filter((item: DeptAndUser) => !checkedId2.includes(item.id));

  return { newScopes, addAndRemoveScope: { add: addList, removes: removeIDList } };
}
