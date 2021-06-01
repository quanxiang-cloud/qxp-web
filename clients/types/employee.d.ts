interface Employee {
  id: string;
  userName: string;
  phone: string;
  email: string;
  userIconURL?: string;
  dep?: Department;
  depIds?: string[];
  authority?: string[];
  roleId?: string;
  deleteId?: string;
  useStatus?: number;
  isDEPLeader?: number;
  depName?: string;
  status?: number;
  position?: string;
  leaderName?: string;
  leaderID?: string;
}

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

type Leader = {
  id: string;
  userName: string;
}
