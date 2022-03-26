declare namespace UserApi {
  interface User {
    userName: string;
    id: string;
  }

  interface SearchUserResponse {
    data: User[];
    total_count: number;
  }

  interface AdminUserProps {
    depID: string;
    limit: number;
    page: number;
    userName: string;
  }

  interface IUserDepartment extends Department {
    createTime?: number;
    updateTime?: number;
  }

  interface IUser {
    createBy?: string;
    createTime: number;
    dep: IUserDepartment;
    email: string;
    id: string;
    phone: string;
    updateTime?: number;
    useStatus?: number;
    userIconURL?: string;
    userName: string;
  }

  interface AdminUserResponse {
    total_count: number;
    data: IUser[];
  }
}

interface Organization {
  departmentName: string,
  id: string;
  pid: string;
  child?: Organization[];
  fullPath?: string;
}
