import * as React from 'react';
import { Route, Switch } from 'react-router';

import { NotFound } from './components/404';

import '@QCFE/lego-ui/lib/scss/lego-ui.min.css';
import '@assets/scss/index.scss';

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

export default function routes(): JSX.Element {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/metadata" component={MetaData} />
        <Route exact path="/accessControl" component={AccessControl} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
