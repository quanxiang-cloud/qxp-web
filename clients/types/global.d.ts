type CurrentUser = {
  id: string;
  userName: string;
  status: number;
  email: string;
  phone: string;
  depIds: string[]
  dep: Department;
}

interface Window {
  USER: CurrentUser;
  USER_ROLES: Role[];
  USER_FUNC_TAGS: string[];
  [key: string]: unknown;
}
