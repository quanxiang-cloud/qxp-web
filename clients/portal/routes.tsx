import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { useQuery } from 'react-query';

import { Error } from '@c/error';

import { getSystemFuncs, getUserFuncs, getUserInfo, getUserRoles } from './api/auth';
import { usePortalGlobalValue } from '@states/portal';
import { Loading } from './components/loading2';

import '@assets/scss/index.scss';

const Dashboard = React.lazy(() => import('./pages/dashboard'));
const MetaData = React.lazy(() => import('./pages/metadata'));
const AccessControl = React.lazy(() => import('./pages/access-control'));

export default function Routes(): JSX.Element {
  const [_, setValue] = usePortalGlobalValue();
  const { data: userData, isLoading: userIsLoading } = useQuery(['getUserInfo'], getUserInfo, {
    refetchOnWindowFocus: false,
    cacheTime: -1,
    retry: false,
  });
  const { data: allFuncs, isLoading: allFunsIsLoading } = useQuery(
    ['getSystemFuncs'],
    getSystemFuncs,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
      retry: false,
      enabled: !!userData?.id,
    },
  );

  const { data: userFuncs, isLoading: userFuncsIsLoading } = useQuery(
    ['getUserFuncs', userData?.depIds],
    getUserFuncs,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
      retry: false,
      enabled: !!(userData?.depIds && userData.depIds.length),
    },
  );
  const { data, isLoading: userRoleIsLoading } = useQuery(
    'getUserRoles',
    () => getUserRoles(userData?.id || '', userData?.depIds || []),
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!(userData?.id && userData?.depIds && userData?.depIds.length),
    },
  );

  useEffect(() => {
    setValue((val) => ({
      ...val,
      authority: allFuncs || [],
      userInfo: {
        ...userData,
        depIds: userData?.depIds || [],
        authority: userFuncs || [],
        roles: data?.roles || [],
      },
    }));
  }, [userData, allFuncs, userFuncs]);

  if (userIsLoading || allFunsIsLoading || userFuncsIsLoading || userRoleIsLoading) {
    return <Loading desc="加载中..." className="w-screen h-screen" />;
  }

  if (!userData || !allFuncs || !userFuncs || !data?.total ||
    (userFuncs && !userFuncs.includes('application'))) {
    return <Error desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/metadata" component={MetaData} />
        <Route path="/access-control" component={AccessControl} />
        <Route component={Error} />
      </Switch>
    </>
  );
}
