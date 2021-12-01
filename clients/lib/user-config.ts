import { useState, useEffect } from 'react';
import { getBatchUserData, setBatchUserData } from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

const configMap: Record<string, unknown> = {};

export function useGetUserConfig<T>(key: string, version: string, fallBack: T): [T, boolean] {
  const hasValue = key in configMap;
  const [userConfig, setUserConfig] = useState<T>(configMap[key] as T);
  const [loading, setLoading] = useState(!hasValue);

  useEffect(() => {
    if (!hasValue) {
      setLoading(true);
      getBatchUserData([{ key, version }]).then((res) => {
        const configRes = parseJSON<T>(res.result[key], fallBack);
        configMap[key] = configRes;
        setUserConfig(configRes);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  return [userConfig, loading];
}

export function setUserConfig(config: any, key: string, version: string): void {
  configMap[key] = config;
  setBatchUserData([{
    key,
    version: version,
    value: JSON.stringify(config),
  }]);
}
