declare enum RoleBindType {
  department = 1,
  employee = 2
}

type EmployeeOrDepartmentOfRole = EmployeeOfRole & DepartmentOfRole;

interface Role {
  id: string;
  name: string;
  tag: string;
}
