import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringify } from 'qs';
import { omitEmpty } from '@portal/utils';

type QueryPage = (path?: string, params?: Record<string, unknown>, refresh?: boolean) => void;

const useRouting = (): QueryPage => {
  const history = useHistory();
  const loc = useLocation();

  const queryPage = (path = '', params = {}, refresh = false) => {
    const { pathname, search } = loc;
    const currentParams = parse(search.slice(1));
    const newParams = refresh ? params : { ...currentParams, ...params };

    history.push(`${path || pathname}?${stringify(omitEmpty(newParams))}`);
  };
  return queryPage;
};

export {
  useRouting,
};
