interface IDepartment {
  departmentName: string;
  id: string;
  pid: string;
  superID: string;
  grade: number;
  child?: Array<IDepartment>;
  departmentLeaderId?: string;
  useStatus?: number;
  superId?: string;
}
