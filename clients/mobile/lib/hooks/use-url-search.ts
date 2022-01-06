import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

type SetSearchInit = string[][] | Record<string, string> | string | URLSearchParams;
type Mode = 'push' | 'replace';

export function useURLSearch(mode: Mode = 'push'): [URLSearchParams, (init?: SetSearchInit) => void] {
  const search = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const { pathname } = useLocation();
  function update(init?: SetSearchInit): void {
    const query = qs.stringify(init);
    const path = `${pathname}${query ? '?' : ''}${query}`;
    mode === 'push' ? history.push(path) : history.replace(path);
  }

  return [search, update];
}
