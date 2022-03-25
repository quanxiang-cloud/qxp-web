declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'web-worker:*' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}

type UserDepartment = {
  id: string;
  name: string;
  leaderID: string;
  pid: string;
  superID: string;
  grade: number;
  attr: 1 | 2;
}
type CurrentUser = {
  id: string;
  avatar: string;
  name: string;
  status: number;
  useStatus: number;
  selfEmail: string;
  email: string;
  phone: string;
  depIds: string[]
  deps: UserDepartment[][];
}

interface Window {
  USER: CurrentUser;
  USER_ADMIN_ROLES: Role[];
  ADMIN_USER_FUNC_TAGS: string[];
  CONFIG: { [key: string]: any; }
  SIDE: 'portal' | 'home';
  [key: string]: any;
}

interface Pagination {
  current: number;
  pageSize: number;
}

type ErrorWithData<T> = Error & T;

type OSSConfig = {
  private: string;
  readable: string;
  domain: string;
}
