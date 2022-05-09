declare enum RoleBindType {
  department = 1,
  employee = 2,
  group = 3
}

type EmployeeOrDepartmentOfRole = EmployeeOfRole & DepartmentOfRole & GroupOfRole;

interface GroupOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  id: string;
  ownerID: string;
  groupName: string;
  type: RoleBindType;
}

interface DepartmentOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  id: string;
  ownerID: string;
  type: RoleBindType;
}

interface EmployeeOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  email: string;
  id: string;
  ownerID: string;
  ownerName: string;
  phone: string;
  type: RoleBindType;
}

interface Role {
  id: string;
  name: string;
  tag: string;
  roleID: string;
}
