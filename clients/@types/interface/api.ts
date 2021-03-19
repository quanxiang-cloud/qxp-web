import '../../../node_modules/@QCFE/types/index';
import '../../../node_modules/@qcfe/types/index';


export interface IResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}
