import React, { ReactNode, useMemo } from 'react';
import { Route } from 'react-router-dom';
import { isArray } from 'lodash';

import { SubRoute, useSubRoute } from '@m/lib/hooks/use-sub-route';

export interface SubRoutePageProps {
  subRoutes: SubRoute | SubRoute[]
  children: ReactNode
}

export default function SubRoutePage(props: SubRoutePageProps): JSX.Element {
  const routes = useMemo<SubRoute[]>(() => {
    if (isArray(props.subRoutes)) {
      return props.subRoutes;
    }
    return [props.subRoutes];
  }, [props.subRoutes]);

  const [isSubRoute] = useSubRoute(routes);

  return (
    <>
      {!isSubRoute && props.children}
      {routes.map((route) =>
        (<Route
          exact={route.exact ?? true}
          path={route.path}
          component={route.component}
          key={route.path}
        />),
      )}
    </>
  );
}
