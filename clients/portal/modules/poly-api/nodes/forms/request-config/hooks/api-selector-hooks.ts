import { useEffect, useMemo, useState } from 'react';
import { toast } from '@one-for-all/ui';
import {
  useGetNamespaceFullPath, useQueryNameSpaceRawRootPath,
} from '@polyApi/effects/api/namespace';
import {
  ApiCascaderOption, ApiOptionData, getChildrenOfCurrentSelectOption, mergeApiListToOptions,
} from '@polyApi/utils/request-node';
import { useGetRequestNodeApiList } from '@polyApi/effects/api/raw';
import { isEmpty } from 'lodash';

export function useGetNamespaceTree(
  appID: string, pathType: 'raw.root' | 'poly',
): ApiOptionData[] {
  const [state, setState] = useState<ApiOptionData[]>([]);
  const { data: namespace, error: fetchRootPathError } = useQueryNameSpaceRawRootPath(appID, pathType);
  const { data: namespaceTree, isLoading, error: fetchNameSpacePathError } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });

  useEffect(() => {
    fetchNameSpacePathError && toast.error(fetchNameSpacePathError.message);
    fetchRootPathError && toast.error(fetchRootPathError.message);
  }, [fetchNameSpacePathError, fetchRootPathError]);

  useEffect(() => {
    if (!isLoading && !namespaceTree) {
      return;
    }

    if (pathType === 'poly') {
      const polyNameSpaceTree = [{
        name: 'poly_api',
        title: '编排 API',
        parent: '/',
        children: namespaceTree?.root.children ?? [],
      }] as any;
      setState(polyNameSpaceTree);
      return;
    }

    setState(namespaceTree?.root.children ?? []);
  }, [namespaceTree, isLoading]);

  return state;
}

export function useGetOptions(
  appID: string, apiNamespacePath: string, usePolyApiOption: boolean,
): ApiCascaderOption[] {
  const rawTree = useGetNamespaceTree(appID, 'raw.root');
  const polyTree = useGetNamespaceTree(appID, 'poly');
  const [options, setOptions] = useState<ApiCascaderOption[] | undefined>();
  const apiNamespacePathTree = useMemo(() => {
    if (usePolyApiOption) {
      return rawTree.concat(polyTree);
    }

    return rawTree;
  }, [polyTree, rawTree]);

  // to prevent poly api root option fetch api list
  let path = apiNamespacePath.slice(1) || '';
  const type = path.split('/')[3];
  if (!type) {
    path = ''; // useGetRequestNodeApiList hook disabled when path is not exist
  }

  const { data: apiListDetails, isLoading, error } = useGetRequestNodeApiList({
    path,
    type,
    body: { active: 1, page: 1, pageSize: -1 },
  }, { enabled: !!path });

  // api cascader load apiList options
  useEffect(() => {
    if ((isLoading && !apiListDetails) || !options) {
      return;
    }

    setOptions(mergeApiListToOptions(options, apiNamespacePath, apiListDetails?.list || []));
  }, [apiListDetails, isLoading]);

  useEffect(() => {
    error && toast.error(error.message);
  }, [error]);

  useEffect(() => {
    if (isEmpty(apiNamespacePathTree)) {
      return;
    }

    setOptions(getChildrenOfCurrentSelectOption(apiNamespacePathTree));
  }, [apiNamespacePathTree]);

  return options || [];
}
