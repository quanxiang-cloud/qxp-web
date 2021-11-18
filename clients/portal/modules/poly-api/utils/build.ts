import { QueryClient } from 'react-query';
import { omit } from 'lodash';
import { isEdge, isNode } from 'react-flow-renderer';

import { nanoid } from '@c/form-builder/utils';
import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import store$ from '../store';
import PolyNodeStore from '../store/node';
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
  const uis: POLY_API.POLY_UIS = {
    edges: [],
    metas: [],
  };
  const nodes = result.nodes?.map((node) => {
    if (isEdge(node)) {
      uis.edges.push(node);
      return false;
    } else if (isNode(node)) {
      const { data, __rf, ...nodeInfo } = node;
      uis.metas.push(nodeInfo);
      return data;
    }
  }).filter(Boolean) || [];
  const arrange = JSON.stringify({
    ...result,
    nodes,
    uis,
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
  const newActive = active ? 0 : 1;
  try {
    await httpClient(`/api/v1/polyapi/poly/active/${path}`, { active: newActive });
    toast.success(newActive ? '上线成功' : '下线成功');
    queryClient.invalidateQueries([POLY, POLY_QUERY]);
  } catch (e) {
    return toast.error(newActive ? '上线失败' : '下线失败');
  }
}

type Arrange = {
  namespace: string;
  name: string;
  desc: string;
  version: string;
  id: string;
  encoding: string;
  nodes: POLY_API.PolyNode[];
  uis: POLY_API.POLY_UIS;
}
export function parsePolySourceFromApi(data: POLY_API.POLY_INFO): void {
  const { arrange } = data;
  try {
    const arrangeResult = JSON.parse(arrange) as Arrange;
    const { nodes = [], uis, ...attrs } = arrangeResult;
    const { metas = [], edges = [] } = uis || {};
    store$.init(attrs);
    const distNodes: POLY_API.Element[] = nodes?.map((node, index) => {
      const nodeInfo = metas[index];
      return { data: new PolyNodeStore(node), ...nodeInfo };
    }) || [];
    store$.value.nodes.set([...distNodes, ...(edges as unknown as POLY_API.EdgeElement[])]);
    store$.set('polyInfo', data);
  } catch (e) {
    console.error(e);
    toast.error('获取编排信息失败');
  }
}
