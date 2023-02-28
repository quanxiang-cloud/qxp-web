import { useEffect, useMemo, useState } from 'react';

import { ApiCascaderOption, getChildrenOfCurrentSelectOption } from '@polyApi/utils/request-node';
import { createCollection, Collection, useCollection, PathType, DirectoryChild } from '@lib/api-collection';

type ApiDirectoryWithPathType = { directory: string, pathType: PathType }
type GetOptionFromCollectionProps = {
  appID: string,
  apiDirectoryWithPathType: ApiDirectoryWithPathType,
  usePolyApiOption: boolean
 };

export function useGetOptionFromCollection({
  appID,
  apiDirectoryWithPathType,
  usePolyApiOption,
}: GetOptionFromCollectionProps): ApiCascaderOption[] {
  const [options, setOptions] = useState<ApiCascaderOption[]>([]);

  const apiCollection: Collection = useMemo(() => {
    const pathTypes = [PathType.RAW_ROOT];
    usePolyApiOption && pathTypes.push(PathType.POLY);
    return createCollection({ appID, pathTypes, mode: 'directoryWithApi' });
  }, []);

  const collectionValue = useCollection(apiCollection);

  useEffect(() => {
    if (!apiDirectoryWithPathType.directory) return;
    apiCollection.onGetApiList(apiDirectoryWithPathType.directory, apiDirectoryWithPathType.pathType);
  }, [apiDirectoryWithPathType]);

  useEffect(() => {
    const directoryChildren = collectionValue.apiDataList?.reduce(
      (directoryChildren: DirectoryChild[], list) => {
        if (!list.directory.children) {
          return directoryChildren;
        }
        let willAppendChildren = list.directory.children;
        if (list.pathType === 'poly') {
          willAppendChildren = [{
            ...list.directory,
            active: 1,
            subCount: list.directory.children.length,
            title: '编排API',
          }];
        }
        return directoryChildren.concat(willAppendChildren);
      },
      []);

    setOptions(getChildrenOfCurrentSelectOption(directoryChildren, apiDirectoryWithPathType.directory));
  }, [collectionValue]);

  return options;
}
