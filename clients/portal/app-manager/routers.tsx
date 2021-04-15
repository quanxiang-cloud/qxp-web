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

const AppSetting = lazy(
  () => import('./pages/app-setting'),
);

const FormDesign = lazy(
  () => import('./pages/form-design')
);

export default (
  <Suspense fallback={(<PageLoading />)}>
    <Switch>
      <Route exact path="/apps/list" component={AppManagerEntry} />
      <Route exact path="/apps/:appId" component={AppDetails} />
      <Route path="/apps/:appId/setting/:tab" component={AppSetting} />
      <Route exact path="/apps/formDesign/:pageType/:navType?" component={FormDesign} />
      <Route component={Error} />
    </Switch>
  </Suspense>
);
