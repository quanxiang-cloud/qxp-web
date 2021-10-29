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

declare module 'draftjs-to-html';
declare module 'html-to-draftjs';
declare module 'react-highlight';

type UserDepartment = {
  id: string;
  departmentName: string;
  departmentLeaderID: string;
  pid: string;
  superID: string;
  grade: number;
  child: UserDepartment;
}
type CurrentUser = {
  id: string;
  userName: string;
  status: number;
  email: string;
  phone: string;
  depIds: string[]
  dep: UserDepartment;
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
