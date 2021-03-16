import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { useQuery } from 'react-query';

import { Error } from './components/Error';

import '@QCFE/lego-ui/lib/scss/lego-ui.min.css';
import '@assets/scss/index.scss';
import { getSystemFuncs, getUserFuncs, getUserInfo } from './api/auth';
import { usePortalGlobalValue } from '@clients/common/state/portal';
import { Loading } from './components/Loading';

const Dashboard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "dashboard" */
      './pages/dashboard'
    ),
);

const MetaData = React.lazy(
  () =>
    import(
      /* webpackChunkName: "dashboard" */
      './pages/metadata'
    ),
);

const AccessControl = React.lazy(() => import('./pages/accessControl'));

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

  useEffect(() => {
    setValue((val) => ({
      ...val,
      authority: allFuncs || [],
      userInfo: {
        ...userData,
        depIds: userData?.depIds || [],
        authority: userFuncs || [],
      },
    }));
  }, [userData, allFuncs, userFuncs]);

  if (userIsLoading || allFunsIsLoading || userFuncsIsLoading) {
    return <Loading desc="加载中..." />;
  }

  if (!userData || !allFuncs || !userFuncs) {
    return <Error desc="something wrong..." />;
  }

  return (
    <>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/metadata" component={MetaData} />
        <Route exact path="/accessControl" component={AccessControl} />
        <Route component={Error} />
      </Switch>
    </>
  );
}
