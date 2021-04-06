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
