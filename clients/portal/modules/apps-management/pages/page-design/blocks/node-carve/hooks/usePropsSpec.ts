import { useState } from 'react';
import { PropsSpec } from '../type';
import { useQuery } from 'react-query';
import { Node } from '@one-for-all/artery';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

export const PAGE_PROPS_SPEC_KEY = 'PACKAGE_PROPS_SPEC';

export default function usePropsSpec(activeNode?: Node) {
  const [propsSpecMap, setPropsSpecMap] = useState<Record<string, Record<string, PropsSpec[]>>>({});
  return function getSpecByPkg(
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
      const res = await getBatchGlobalConfig([
        {
          key: personalKey,
          version: version,
        },
      ]);
      const result = parseJSON(res.result?.[personalKey], {});
      const spec = Object.entries(result).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key.toLowerCase()]: value,
        };
      }, {});
      setPropsSpecMap({
        ...propsSpecMap,
        [specKey]: spec,
      });
      return spec;
    });
    return [isLoading, data || null, isError];
  };
}

export function versionCompare(v1: string, v2: string): number {
  if (v1 === 'lastest' && v2 === 'lastest') {
    return 0;
  }
  if (v1 === 'lastest') {
    return 1;
  }
  if (v1 === 'lastest') {
    return -1;
  }

  const v1parts = v1.split('.').map(Number);
  const v2parts = v2.split('.').map(Number);

  while (v1parts.length < v2parts.length) v1parts.push(0);
  while (v2parts.length < v1parts.length) v2parts.push(0);

  for (let i = 0; i < v1parts.length; i = i + 1) {
    if (v2parts.length === i) {
      return 1;
    }

    if (v1parts[i] === v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length !== v2parts.length) {
    return -1;
  }

  return 0;
}
