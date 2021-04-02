import '@QCFE/types';
// @ts-ignore
import '@qcfe/types';

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
