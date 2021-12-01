import { QueryClient } from 'react-query';
import { omit } from 'lodash';
import { isEdge, isNode } from 'react-flow-renderer';

import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import store$ from '../store';
import PolyNodeStore from '../store/node';
import { POLY, POLY_QUERY } from '../effects/api/names';

const excludes = ['currentNodeConfigParams', 'polyInfo'];
function getArrange(): [string, string, 0 | 1, string] {
  const polyApiResult = store$.getRootValue();
  const { polyInfo } = polyApiResult;
  if (!polyInfo) {
    return ['', '', 0, ''];
  }
  const apiPath = `${polyInfo.namespace}/${polyInfo.name}`.slice(1);
  const result = {
    ...omit(polyInfo, excludes),
    nodes: polyApiResult.nodes,
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
  const arrange = JSON.stringify({ nodes, uis });
  return [apiPath, arrange, polyInfo.active, result.title || ''];
}

export function savePolyApiResult(): void {
  const [path, arrange, _, title] = getArrange();
  if (!path || !arrange) {
    return;
  }
  try {
    httpClient(`/api/v1/polyapi/poly/save/${path}`, { arrange, title });
    toast.success('保存成功');
  } catch (e) {
    toast.error('保存失败');
  }
}

export async function buildPoly(): Promise<any> {
  const [path, arrange, _, title] = getArrange();
  try {
    await httpClient(`/api/v1/polyapi/poly/build/${path}`, { arrange, title });
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

type Arrange = POLY_API.POLY_INFO & {
  nodes: POLY_API.PolyNode[];
  uis: POLY_API.POLY_UIS;
}
export function parsePolySourceFromApi(data: POLY_API.POLY_INFO & { arrange: string }): void {
  const { arrange, ...polyInfo } = data;
  try {
    const arrangeResult = JSON.parse(arrange) as Arrange;
    const { nodes = [], uis } = arrangeResult;
    const { metas = [], edges = [] } = uis || {};
    store$.init(polyInfo);
    const distNodes: POLY_API.Element[] = nodes?.map((node, index) => {
      const nodeInfo = metas[index];
      return { data: new PolyNodeStore(node), ...nodeInfo };
    }) || [];
    store$.value.nodes.set([...distNodes, ...(edges as unknown as POLY_API.EdgeElement[])]);
  } catch (e) {
    toast.error('获取编排信息失败');
  }
}
