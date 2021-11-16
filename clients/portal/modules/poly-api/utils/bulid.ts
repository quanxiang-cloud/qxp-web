
import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import store$ from '../store';

export function buildPoly(): Promise<any> {
  const polyApiResult = store$.getRootValue();
  if (polyApiResult.polyInfo?.name) {
    const namespace = polyApiResult.polyInfo?.namespace;
    const buildApiPath = `${namespace}/${polyApiResult.polyInfo.name}`.slice(1);
    return httpClient(`/api/v1/polyapi/poly/active/${buildApiPath}`).then(() => {
      toast.success('调试成功');
    }).catch(() => toast.error('调试失败'));
  }

  return Promise.resolve();
}

export function publishPoly(): Promise<any> {
  const polyApiResult = store$.getRootValue();
  if (polyApiResult.polyInfo?.name) {
    const namespace = polyApiResult.polyInfo?.namespace;
    const publishApiPath = `${namespace}/${polyApiResult.polyInfo.name}`.slice(1);
    return httpClient(`/api/v1/polyapi/poly/valid/${publishApiPath}`, { valid: 1 }).then(() => {
      toast.success('上线成功');
    }).catch(() => toast.error('上线失败'));
  }

  return Promise.resolve();
}
