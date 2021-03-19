import '../../../node_modules/@QCFE/types/index';
// @ts-ignore
import '../../../node_modules/@qcfe/types/index';


export interface IResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}
