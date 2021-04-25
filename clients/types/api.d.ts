interface ResponseToBeDelete<T> {
  code: number;
  msg?: string;
  data?: T;
}
