type Employee = {
  address: string;
  avatar: string;
  companyID: string;
  dep: DepartmentInfo
  email: string;
  id: string;
  leaderID: string;
  phone: string;
  userName: string;
}

type DepartmentInfo = {
  companyID: string;
  departmentLeaderID: string;
  departmentName: string;
  grade: number;
  id: string;
  pid: string;
  superID: string;
  useStatus: number;
}
