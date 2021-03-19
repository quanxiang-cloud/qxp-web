interface Department {
  departmentName: string;
  id: string;
  pid: string;
  superID: string;
  grade: number;
  child?: Array<Department>;
}
