import { omit } from 'lodash';

import toast from '@lib/toast';
import httpClient from '@lib/http-client';
import { nanoid } from '@c/form-builder/utils';

import store$ from '../store';

const excludes = ['currentNodeConfigParams', 'polyInfo'];
export function savePolyApiResult(): void {
  const polyApiResult = store$.getRootValue();
  if (polyApiResult.polyInfo?.name) {
    const namespace = polyApiResult.polyInfo.namespace;
    const saveApiPath = `${namespace}/${polyApiResult.polyInfo.name}`.slice(1);
    const result = {
      ...omit(polyApiResult, excludes),
      id: nanoid(),
      namespace,
    };
    httpClient(`/api/v1/polyapi/poly/save/${saveApiPath}`, {
      arrange: {
        ...result,
        nodes: result.nodes?.map((node) => omit(node, '__rf')) || [],
      },
    }).then(() => {
      toast.success('保存成功');
    }).catch(() => toast.error('Api编排保存失败'));
  }
}
