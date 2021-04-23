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

declare module 'draftjs-to-html';
declare module 'html-to-draftjs';

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
  depName?: string;
  status?: number;
}

interface Window {
  USER: UserInfo;
  [key: string]: unknown;
}
