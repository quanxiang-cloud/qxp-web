import { useUpdateEffect, usePrevious } from 'react-use';
import { isEmpty } from 'ramda';

import store$ from '@polyApi/store';

export function useNodeSaver(data: POLY_API.PolyNode): void {
  const previouseData = usePrevious(data);

  useUpdateEffect(() => {
    if (!isEmpty(previouseData) && data) {
      console.log('保存', store$.getRootValue());
    }
  }, [data]);
}
