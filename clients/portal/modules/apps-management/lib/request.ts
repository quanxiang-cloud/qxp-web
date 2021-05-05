import axios, {
  Method, AxiosPromise, AxiosResponse, AxiosError, ResponseType, CancelToken,
} from 'axios';
import { stringify } from 'qs';

import toast from '@lib/toast';

axios.defaults.timeout = 11000;
axios.defaults.headers.common['X-Proxy'] = 'API';

export type APIRequestParam = {
  method: Method;
  url: string;
  params?: Record<string, string | number | boolean | Array<string | number>> | string;
  data?: any;
  responseType?: ResponseType;
  cancelToken?: CancelToken;
}

export interface APIResponse extends AxiosResponse {
  msg?: string;
  code?: number;
  data: any
}

export default (opt: APIRequestParam): AxiosPromise => {
  return new Promise((resolve, reject) => {
    axios({
      ...opt,
      paramsSerializer: (params) => {
        return stringify(params, { arrayFormat: 'repeat' });
      },
    }).then((response: APIResponse) => {
      if (response.data.code !== 0) {
        toast.error(response.data.msg);
        reject(response);
      }

      resolve(response.data);
    }).catch((error: AxiosError) => {
      axios.isCancel(error);
      const { response } = error;
      if (response?.status !== 200) {
        toast.error('网络出错，请稍后再试！');
      }
      reject(response);
    });
  });
};
