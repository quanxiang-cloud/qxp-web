import '@QCFE/types';
// @ts-ignore
import '@qcfe/types';


export interface Response<T> {
  code: number;
  msg?: string;
  data?: T;
}
