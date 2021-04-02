interface Department {
  departmentName: string;
  id: string;
  pid: string;
  superID: string;
  grade: number;
  child?: Array<Department>;
  departmentLeaderId?: string;
  useStatus?: number;
  superId?: string;
}

interface DepartmentOfRole {
  createdAt: number;
  departmentID: string;
  departmentName: string;
  id: string;
  ownerID: string;
  type: RoleBindType;
}
