import '@QCFE/types';
// @ts-ignore
import '@qcfe/types';


export interface IResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}
