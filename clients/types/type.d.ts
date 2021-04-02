interface UserInfo {
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
}

type DeptInfo = {
  departmentName: string;
  id: string;
  pid?: string;
};

type DeptTree = {
  child: Array<DeptTree>;
  departmentName: string;
  grade: number;
  id: string;
  superID: string;
  useStatus: number;
};

type Columns = {
  title: string;
  dataIndex: string;
  width?: number;
  key?: string;
  render?: (...args: any[]) => JSX.Element;
}[]

type SizeType = 'small' | 'middle' | 'large' | undefined;

interface QxpWindow extends Window {
  __global: {
    userInfo: UserInfo;
  }
}
