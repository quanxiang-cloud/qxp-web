import { useMemo } from 'react';
import { cond, and, always, T } from 'ramda';

import useObservable from '@lib/hooks/use-observable';
import store$ from '@polyApi/store';
import getPathTreeSource from '@polyApi/utils/get-path-tree-source';

export default function usePathTreeSource(): POLY_API.PolyNodeInput[] {
  const polyNodeStore = useObservable(store$);
  const apiRequestNodeId = polyNodeStore.currentNodeConfigParams?.currentNode?.get('name') as string;

  return useMemo(() => {
    const getTreeSource = cond([
      [() => and(!!polyNodeStore, !!apiRequestNodeId), always(getPathTreeSource(apiRequestNodeId))],
      [T, always([])],
    ]);
    return getTreeSource();
  }, [apiRequestNodeId, polyNodeStore]);
}
