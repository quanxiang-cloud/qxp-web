import '../../../node_modules/@QCFE/types/index';

export interface IResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}
