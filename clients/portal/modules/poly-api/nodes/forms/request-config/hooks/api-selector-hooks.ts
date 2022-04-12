import { useEffect, useMemo, useState } from 'react';
import {
  ApiCascaderOption, getChildrenOfCurrentSelectOption,
} from '@polyApi/utils/request-node';
import { createCollection, Collection, useCollection, PathType, DirectoryChild } from '@lib/api-collection';

export function useGetOptionFromCollection(appID: string,
  apiPathWithType: {path: string, pathType: PathType},
  usePolyApiOption: boolean): ApiCascaderOption[] {
  const [options, setOptions] = useState<ApiCascaderOption[]>([]);
  const apiCollection: Collection = useMemo(() => {
    const pathTypes = [PathType.RAW_ROOT];
    usePolyApiOption && pathTypes.push(PathType.POLY);
    return createCollection({ appID, pathTypes, mode: 'directoryWithApi' });
  }, [appID, usePolyApiOption]);

  const collectionValue = useCollection(apiCollection);

  useEffect(() => {
    if (!apiPathWithType.path) return;
    apiCollection.onGetApiList(apiPathWithType.path, apiPathWithType.pathType);
  }, [apiPathWithType]);

  useEffect(() => {
    const directoryChildren = collectionValue.apiDataList.reduce(
      (directoryChildren: DirectoryChild[], list) => {
        return list.directory.children ?
          directoryChildren.concat(list.directory.children) :
          directoryChildren;
      },
      []);
    setOptions(getChildrenOfCurrentSelectOption(directoryChildren, apiPathWithType.path) || []);
  }, [collectionValue]);

  return options;
}
