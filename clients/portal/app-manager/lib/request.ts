import axios, {
  Method, AxiosPromise, AxiosResponse, AxiosError, ResponseType, CancelToken,
} from 'axios';
import { Message } from '@QCFE/lego-ui';
import { stringify } from 'query-string';

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
        reject(response);
      }

      resolve(response.data.data);
    }).catch((error: AxiosError) => {
      if (axios.isCancel(error)) return;
      const { response } = error;
      Message.error(response.data.msg);
    });
  });
};
