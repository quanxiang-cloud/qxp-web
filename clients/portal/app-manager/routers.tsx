import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

import PageLoading from '@appC/page-loading';
import Error from '@c/error';

const AppManagerEntry = lazy(
  () => import('./pages/entry'),
);

const AppDetails = lazy(
  () => import('./pages/app-details'),
);

const FormDesign = lazy(
  () => import('./pages/form-design'),
);

export default (
  <Suspense fallback={(<PageLoading />)}>
    <Switch>
      <Route exact path="/apps/:navType" component={AppManagerEntry} />
      <Route path="/apps/details/:appId" component={AppDetails} />
      <Route
        exact
        path="/apps/formDesign/:pageType/:appId/:pageId/:navType?"
        component={FormDesign}
      />
      <Route component={Error} />
    </Switch>
  </Suspense>
);
