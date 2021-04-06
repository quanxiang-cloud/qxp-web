import '@QCFE/types';
// @ts-ignore
import '@qcfe/types';

import Notify from '@clients/lib/notify';

interface Response<T> {
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
