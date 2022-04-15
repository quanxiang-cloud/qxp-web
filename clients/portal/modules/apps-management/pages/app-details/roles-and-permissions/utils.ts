import { SCOPE } from './constants';

type getAddAndRemovePersonResult = {
  newScopes: DeptAndUser[],
  addAndRemoveScope: {
    add: DeptAndUser[],
    removes: string[]
  }
}

export function getScopeQuery(type: number, ids: string[]): string {
  const query = type === SCOPE.DEP ?
    `{query(ids:${JSON.stringify(ids)}){departments{id,name}}}` :
    `{query(ids:${JSON.stringify(ids)}){users{id,email,name,phone,departments{id,name}}}}`;
  return query;
}

export function getAddAndRemovePerson(
  oldScopes: DeptAndUser[],
  deptList: EmployeeOrDepartmentOfRole[],
  employees: EmployeeOrDepartmentOfRole[]): getAddAndRemovePersonResult {
  const newScopes: DeptAndUser[] = [...deptList, ...employees].map((scope) => {
    return {
      type: scope.type,
      id: scope.id,
      name: scope.ownerName,
    };
  });
  const deletes: DeptAndUser[] = oldScopes.filter((member: { id: string; }) => {
    return !newScopes.find((m) => m.id === member.id);
  });
  const adds: DeptAndUser[] = newScopes.filter((member) => {
    return !oldScopes.find((m: { id: string; }) => m.id === member.id);
  });

  const addAndRemoveScope = {
    add: adds,
    removes: deletes?.map(({ id }: { id: string }) => id),
  };

  return { newScopes, addAndRemoveScope };
}
