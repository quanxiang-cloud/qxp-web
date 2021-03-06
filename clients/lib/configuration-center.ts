import { useState, useEffect } from 'react';
import {
  getBatchUserData,
  setBatchUserData,
  getBatchGlobalConfig,
  setBatchGlobalConfig,
} from '@lib/api/user-config';
import { parseJSON } from '@lib/utils';

const userConfigMapTmp: Record<string, unknown> = {};
const globalConfigMapTmp: Record<string, unknown> = {};

export function useGetUserConfig<T>(
  key: string,
  version: string,
  fallback: T,
): [T, boolean] {
  const hasValue = key in userConfigMapTmp;
  const [userConfig, setUserConfig] = useState<T>(userConfigMapTmp[key] as T);
  const [loading, setLoading] = useState(!hasValue);

  useEffect(() => {
    if (!hasValue) {
      setLoading(true);
      getBatchUserData([{ key, version }]).then((res) => {
        const configRes = parseJSON<T>(res.result[key], fallback);
        userConfigMapTmp[key] = configRes;
        setUserConfig(configRes);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  return [userConfig, loading];
}

export function setUserConfig(config: any, key: string, version: string): void {
  userConfigMapTmp[key] = config;
  setBatchUserData([{
    key,
    version: version,
    value: JSON.stringify(config),
  }]);
}

export function useGetGlobalConfig<T>(
  key: string,
  version: string,
  fallback: T,
): [T, boolean] {
  const hasValue = key in globalConfigMapTmp;
  const [userConfig, setUserConfig] = useState<T>(globalConfigMapTmp[key] as T);
  const [loading, setLoading] = useState(!hasValue);

  useEffect(() => {
    if (!hasValue) {
      setLoading(true);
      getBatchGlobalConfig([{ key, version }]).then((res) => {
        const configRes = parseJSON<T>(res.result[key], fallback);
        globalConfigMapTmp[key] = configRes;
        setUserConfig(configRes);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  return [userConfig, loading];
}

export function setGlobalConfig(key: string, version: string, config: any): void {
  // define a local variable is necessary,
  // if config can not be stringified, an error will be throw
  const configStr = JSON.stringify(config);

  globalConfigMapTmp[key] = config;
  setBatchGlobalConfig([{
    key,
    version: version,
    value: configStr,
  }]);
}
