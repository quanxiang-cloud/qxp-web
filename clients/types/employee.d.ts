interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  selfEmail?: string;
  idCard?: string;
  address?: string;
  avatar?: string;
  jobNumber?: string;
  gender?: 0 | 1 | 2;
  source?: string;
  useStatus?: number;
  status?: number;
  position?: string;
  depName?: string;
  departments?: Department[][];
  deps?: Department[][];
  leaders?: Leader[][];
}

interface EmployeeOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  deps?: { departmentID: string; departmentName: string; pid: string }[]
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
  name: string;
}
