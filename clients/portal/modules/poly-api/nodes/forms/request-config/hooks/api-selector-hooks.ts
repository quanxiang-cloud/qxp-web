import { useEffect, useMemo, useState } from 'react';
import { toast } from '@ofa/ui';
import {
  useGetNamespaceFullPath, useQueryNameSpaceRawRootPath,
} from '@portal/modules/poly-api/effects/api/namespace';
import {
  ApiCascaderOption, getChildrenOfCurrentSelectOption, mergeApiListToOptions,
} from '@portal/modules/poly-api/utils/request-node';
import { useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/raw';
import { isEmpty } from 'lodash';

export function useGetNamespaceTree(
  appID: string, pathType: 'raw.root' | 'poly',
): any {
  const [state, setState] = useState([]);
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

    setState(namespaceTree?.root.children ?? []);
  }, [namespaceTree, isLoading]);

  return state;
}

export function useGetOptions(
  appID: string, apiNamespacePath: string, useInPoly: boolean,
): ApiCascaderOption[] {
  const rawTree = useGetNamespaceTree(appID, 'raw.root');
  const polyTree = useGetNamespaceTree(appID, 'poly');
  const [options, setOptions] = useState<ApiCascaderOption[] | undefined>();
  const apiNamespacePathTree = useMemo(() => {
    if (useInPoly) {
      return rawTree;
    }

    return rawTree.concat(polyTree);
  }, [polyTree, rawTree]);

  const { data: apiListDetails, isLoading, error } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { active: 1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

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
