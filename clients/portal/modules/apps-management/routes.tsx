import React from 'react';
import { Route, Switch } from 'react-router';

const NewFlow = React.lazy(() => import('./work-flow/detail'));

const AppManagerEntry = React.lazy(
  () => import('./apps-main'),
);
const AppDetails = React.lazy(
  () => import('./pages/app-details'),
);
const FormDesign = React.lazy(
  () => import('./pages/form-design'),
);

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/apps" component={AppManagerEntry} />
      <Route path="/apps/details/:appId" component={AppDetails} />
      <Route
        exact
        path="/apps/formDesign/:pageType/:pageId/:appID/:navType?"
        component={FormDesign}
      />
      <Route path="/apps/flow/new/:type" component={NewFlow} />
    </Switch>
  );
}
