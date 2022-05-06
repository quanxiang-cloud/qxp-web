import { useCallback, useState } from 'react';
import PropsSpecJson from './legacy-props-spec.json';
import { PropsSpec } from '../type';
import { useQuery } from 'react-query';
import { Node } from '@one-for-all/artery';
// import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

export const PAGE_PROPS_SPEC_KEY = 'PAGE_PROPS_SPEC';

export default function usePropsSpec(activeNode?: Node) {
  const [propsSpecMap, setPropsSpecMap] = useState<Record<string, Record<string, PropsSpec[]>>>({});
  return useCallback(function getSpecByPkg(
    pkg: string,
    version: string,
  ): [boolean, Record<string, PropsSpec[]> | null, boolean] {
    if (!activeNode) {
      return [false, null, true];
    }
    const specKey = `${pkg}@${version}`;
    const personalKey = `${PAGE_PROPS_SPEC_KEY}:${pkg}`;
    const { isLoading, data, isError } = useQuery([activeNode?.id], async () => {
      if (propsSpecMap[specKey]) {
        return propsSpecMap[specKey];
      }
      // const res = await getBatchGlobalConfig([
      //   {
      //     key: personalKey,
      //     version: version,
      //   },
      // ]);
      // const result = res.result?.[personalKey]
      const result = JSON.stringify(PropsSpecJson);
      setPropsSpecMap({
        ...propsSpecMap,
        [specKey]: parseJSON(result, {}),
      });
      return parseJSON(result, {});
    });
    return [isLoading, data || null, isError];
  }, []);
}
