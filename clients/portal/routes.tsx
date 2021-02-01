import * as React from 'react';
import { Route } from 'react-router';

import '@assets/scss/index.scss';


const Dashboard = React.lazy(() => import(
  /* webpackChunkName: "dashboard" */
  './pages/dashboard'
));

const MetaData = React.lazy(() => import(
  /* webpackChunkName: "dashboard" */
  './pages/metadata'
));

export default function routes(): JSX.Element {
  return (
    <>
      <Route exact path="/" component={Dashboard} />
      <Route path="/metadata" component={MetaData} />
    </>
  );
}
