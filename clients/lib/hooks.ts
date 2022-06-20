import qs from 'qs';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getBatchGlobalConfig } from './api/user-config';
import { parseJSON } from './utils';

type SetSearch = (init?: string[][] | Record<string, string> | string | URLSearchParams) => void;

export function useURLSearch(): [URLSearchParams, SetSearch] {
  const search = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const { pathname } = useLocation();
  function update(init?: string[][] | Record<string, string> | string | URLSearchParams): void {
    const query = qs.stringify(init);
    history.push(`${pathname}${query ? '?' : ''}${query}`);
  }

  return [search, update];
}

export function useConfig<T>(
  key: string,
  version: string,
  fallback: T,
): [T | undefined, boolean] {
  const [config, setConfig] = useState<T>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBatchGlobalConfig([{ key, version }]).then((res) => {
      const configRes = parseJSON<T>(res.result[key], fallback);
      setConfig(configRes);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return [config, loading];
}
