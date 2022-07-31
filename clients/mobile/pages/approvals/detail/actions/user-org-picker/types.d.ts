declare namespace UserApi {
  interface User {
    name: string;
    id: string;
  }

  interface SearchUserResponse {
    users: User[];
    total: number;
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
    email: string;
    id: string;
    phone: string;
    name: string;
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
