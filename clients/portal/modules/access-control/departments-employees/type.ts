export enum UserStatus {
  normal = 1,
  disable = -2,
  delete = -1
}

export enum LeaderStatus {
  true = 1,
  false = -1
}

export enum FileUploadStatus {
  init = 0,
  success = 1,
  depSuccess = 2,
  fail = 3
}

export type UserInfo = {
  name?: string;
  useStatus?: number;
  phone?: string,
  email?: string,
  position?: string,
}

export type EmployeesList = {
  users: Employee[];
  total: number;
};
