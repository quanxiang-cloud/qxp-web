import { useUpdateEffect, usePrevious } from 'react-use';
import { isEmpty } from 'ramda';
import { omit } from 'lodash';

import store$ from '@polyApi/store';
import { nanoid } from '@c/form-builder/utils';
import { savePolyApiResult } from '@polyApi/utils/save';
import toast from '@lib/toast';

const excludes = ['currentNodeConfigParams', 'polyInfo'];
export function useNodeSaver(data: POLY_API.PolyNode): void {
  const previouseData = usePrevious(data);

  useUpdateEffect(() => {
    if (!isEmpty(previouseData) && data) {
      const polyApiResult = store$.getRootValue();
      if (polyApiResult.polyInfo?.name) {
        const namespace = polyApiResult.polyInfo?.namespace;
        const saveApiPath = `${namespace}/${polyApiResult.polyInfo.name}`.slice(1);
        const result = {
          ...omit(polyApiResult, excludes),
          id: nanoid(),
          namespace,
        };
        savePolyApiResult(saveApiPath, JSON.stringify(result)).then(() => {
          toast.success('保存成功');
        }).catch(() => toast.error('Api编排保存失败'));
      }
    }
  }, [data]);
}
