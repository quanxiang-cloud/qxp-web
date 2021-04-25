interface EmployeeOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  email: string;
  id: string
  ownerID: string;
  ownerName: string;
  phone: string;
  type: RoleBindType;
}

type EmployeeTableColumn = {
  title: string;
  dataIndex: string;
  width?: number;
  key?: string;
  render?: (...args: any[]) => JSX.Element;
}
