import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringify } from 'qs';
import { omitEmpty } from '@clients/utils';

interface History {
  push(path: unknown, state?: any): void;
}

type QueryPage=(path?: string, params?: Record<string, unknown>, refresh?: boolean)=> void;

const useRouting = (): [History, QueryPage] => {
  const history = useHistory();
  const loc = useLocation();

  const queryPage = (path='', params = {}, refresh = false) => {
    const { pathname, search } = loc;
    const currentParams = parse(search.slice(1));
    const newParams = refresh ? params : { ...currentParams, ...params };

    history.push(`${path || pathname}?${stringify(omitEmpty(newParams))}`);
  };
  return [history, queryPage];
};

export default useRouting;
