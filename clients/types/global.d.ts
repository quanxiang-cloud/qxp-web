declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'draftjs-to-html';
declare module 'html-to-draftjs';

interface Window {
  __global: {
    userInfo: UserInfo;
  },
  [key: string]: unknown;
}
