import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { useQuery } from 'react-query';
import { isEmpty } from 'lodash';

import Error from '@c/error';
import Loading from '@c/loading';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';
import { getNestedPropertyToArray } from '@lib/utils';
import { getUserFuncs, getUserRoles } from '@lib/api/auth';

const Dashboard = React.lazy(() => import('./pages/dashboard'));
const MetaData = React.lazy(() => import('./pages/metadata'));
const AccessControl = React.lazy(() => import('./pages/access-control'));
const FormBuilderDemo = React.lazy(() => import(
  /* webpackChunkName: "form-builder-demo" */
  './pages/form-builder-demo'
));

const { userInfo } = window.__global || {};
if (userInfo && !isEmpty(userInfo)) {
  userInfo.depIds = getNestedPropertyToArray<string>(userInfo?.dep, 'id', 'child');
}

export default function Routes(): JSX.Element {
  const [_, setValue] = usePortalGlobalValue();
  const { data: funcs, isLoading: funcsIsLoading } = useQuery(
    ['GET_USER_FUNCS', userInfo?.depIds],
    getUserFuncs,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
      retry: false,
      enabled: !!(userInfo?.depIds && userInfo.depIds.length),
    },
  );
  const { data, isLoading: rolesIsLoading } = useQuery(
    'GET_USER_ROLES',
    () => getUserRoles(userInfo?.id || '', userInfo?.depIds || []),
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!(userInfo?.id && userInfo?.depIds && userInfo?.depIds.length),
    },
  );

  useEffect(() => {
    setValue((val) => ({
      ...val,
      userInfo: {
        ...userInfo,
        depIds: userInfo?.depIds || [],
        authority: funcs || [],
        roles: data?.roles || [],
      },
    }));
  }, [funcs, data?.roles]);


  if (funcsIsLoading || rolesIsLoading) {
    return <Loading desc="加载中..." className="w-screen h-screen" />;
  }

  // if (!funcs || !data?.total || (funcs && !funcs.includes('application'))) {
  //   return <Error desc="您没有权限, 请联系管理员..." />;
  // }

  return (
    <>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/metadata" component={MetaData} />
        <Route path="/access-control" component={AccessControl} />
        <Route path="/form-builder-demo" component={FormBuilderDemo} />
        <Route component={Error} />
      </Switch>
    </>
  );
}
