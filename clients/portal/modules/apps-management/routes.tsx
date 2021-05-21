import React from 'react';
import { Route, Switch } from 'react-router-dom';

const AppsIndex = React.lazy( () => import('./index'));
const AppDetails = React.lazy(() => import('./pages/app-details'));
const FormDesign = React.lazy(() => import('./pages/form-design'));

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/apps" component={AppsIndex} />
      <Route path="/apps/details/:appID" component={AppDetails} />
      <Route
        exact
        path="/apps/formDesign/:pageType/:pageId/:appID/:navType?"
        component={FormDesign}
      />
    </Switch>
  );
}
