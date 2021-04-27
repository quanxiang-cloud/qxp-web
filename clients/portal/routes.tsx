import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { useQuery } from 'react-query';
import { isEmpty } from 'lodash';

import Error from '@c/error';
import Loading from '@c/loading';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';
import { getNestedPropertyToArray } from '@lib/utils';
import { getUserFuncs, getUserAdminRoles } from '@lib/api/auth';

const Dashboard = React.lazy(() => import('./pages/dashboard'));
const MetaData = React.lazy(() => import('./pages/metadata'));
const AccessControl = React.lazy(() => import('./pages/access-control'));
const SystemMgmt = React.lazy(() => import('./pages/system-mgmt'));

const { USER } = window;
if (USER && !isEmpty(USER)) {
  USER.depIds = getNestedPropertyToArray<string>(USER?.dep, 'id', 'child');
}

export default function Routes(): JSX.Element {
  const [, setValue] = usePortalGlobalValue();
  const { data: funcs, isLoading: funcsIsLoading } = useQuery(
    ['GET_USER_FUNCS', USER?.depIds],
    getUserFuncs,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
      retry: false,
      enabled: !!(USER?.depIds && USER.depIds.length),
    },
  );
  const { data, isLoading: rolesIsLoading } = useQuery(
    'GET_USER_ADMIN_ROLES',
    () => getUserAdminRoles(),
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!(USER?.id && USER?.depIds && USER?.depIds.length),
    },
  );

  useEffect(() => {
    setValue((val) => ({
      ...val,
      userInfo: {
        ...USER,
        depIds: USER?.depIds || [],
        authority: funcs || [],
        roles: data?.roles || [],
      },
    }));
  }, [funcs, data?.roles]);

  if (funcsIsLoading || rolesIsLoading) {
    return <Loading desc="加载中..." className="w-screen h-screen" />;
  }

  if (!funcs || !data?.total || (funcs && !funcs.includes('application'))) {
    return <Error desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/metadata" component={MetaData} />
        <Route path="/access-control" component={AccessControl} />
        <Route path="/system" component={SystemMgmt} />
        <Route component={Error} />
      </Switch>
    </>
  );
}
