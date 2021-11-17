import { QueryClient } from 'react-query';
import { omit } from 'lodash';

import { nanoid } from '@c/form-builder/utils';
import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import store$ from '../store';
import { POLY, POLY_QUERY } from '../effects/api/names';

const excludes = ['currentNodeConfigParams', 'polyInfo'];
function getArrange(): [string, string, 0 | 1] {
  const polyApiResult = store$.getRootValue();
  if (!polyApiResult.polyInfo) {
    throw new Error('PolyInfo not found');
  }
  const namespace = polyApiResult.polyInfo.namespace;
  const apiPath = `${namespace}/${polyApiResult.polyInfo.name}`.slice(1);
  const result = {
    ...omit(polyApiResult, excludes),
    id: nanoid(),
    namespace,
  };
  const arrange = JSON.stringify({
    ...result,
    nodes: result.nodes?.map((node) => omit(node, '__rf')) || [],
  });
  return [apiPath, arrange, polyApiResult.polyInfo.active];
}

export function savePolyApiResult(): void {
  const [path, arrange] = getArrange();
  try {
    httpClient(`/api/v1/polyapi/poly/save/${path}`, { arrange });
    toast.success('保存成功');
  } catch (e) {
    toast.error('保存失败');
  }
}

export async function buildPoly(): Promise<any> {
  const [path, arrange] = getArrange();
  try {
    await httpClient(`/api/v1/polyapi/poly/build/${path}`, { arrange });
    toast.success('调试成功');
  } catch (e) {
    return toast.error('调试失败');
  }
}

export async function publishPoly(queryClient: QueryClient): Promise<any> {
  const [path, _, active] = getArrange();
  try {
    await httpClient(`/api/v1/polyapi/poly/active/${path}`, { active });
    toast.success(active ? '上线成功' : '下线成功');
    queryClient.invalidateQueries([POLY, POLY_QUERY]);
  } catch (e) {
    return toast.error(active ? '上线失败' : '下线失败');
  }
}
