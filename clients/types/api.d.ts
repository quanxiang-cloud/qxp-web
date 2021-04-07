interface ResponseToBeDelete<T> {
  code: number;
  msg?: string;
  data?: T;
}

interface IPagination {
  total: number;
  current: number;
  pageSize: number;
}

declare global {
  interface Window {
    __global: {
      userInfo: UserInfo;
    },
    closeNotify: (e: Event | HTMLElement) => void,
    notifier: Notify,
  }
}
