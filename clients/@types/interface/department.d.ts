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

interface IDepartmentWithParent extends Department {
  parent: Department[];
}
