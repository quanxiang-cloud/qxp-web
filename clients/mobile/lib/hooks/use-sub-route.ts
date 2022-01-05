import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { matchPath, RouteComponentProps } from 'react-router';

export interface SubRoute {
  path: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  exact?: boolean;
}

type UseSubRouteReturn = [isSubRoute: boolean, setSubRoute: Dispatch<SetStateAction<boolean>>];

export function useSubRoute(
  subRoutes: SubRoute[],
  effect?: (isSubRoute: boolean) => (void | (() => void)),
): UseSubRouteReturn {
  const [isSubRoute, setSubRoute] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const subRouteIndex = subRoutes.findIndex((route) =>
      matchPath(history.location.pathname, {
        path: route.path, exact: route.exact ?? true,
      }),
    );
    let _isSubRoute = true;
    if (subRouteIndex < 0) {
      _isSubRoute = false;
      setSubRoute(false);
    }
    const destructor = effect?.(_isSubRoute);
    if (destructor) return destructor;
  }, [history.location.pathname]);
  return [isSubRoute, setSubRoute];
}
