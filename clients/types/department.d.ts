interface Department {
  id: string;
  name: string;
  useStatus?: number;
  pid: string;
  superID: string;
  grade: number;
  child?: Array<Department>;
  leaderID?: string;
  attr: string | number;
  // deprecated
  departmentName?: string;
  departmentLeaderId?: string;
  superId?: string;
}

interface DepartmentOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  id: string;
  ownerID: string;
  ownerName: string;
  pid?: string;
  type: RoleBindType;
}

type DeptInfo = {
  name: string;
  id: string;
  pid?: string;
  attr: string | number;
};
