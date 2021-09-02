import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import List from './api-list';
import Add from './add-api';
import Detail from './api-detail';

function ApiProxy() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={List} />
      <Route exact path={`${path}/:groupId`} component={List} />
      <Route exact path={`${path}/:groupId/add`} component={Add} />
      <Route exact path={`${path}/:groupId/:apiId`} component={Detail} />
      <Route exact path={`${path}/:groupId/:apiId/edit`} component={Add} />
    </Switch>
  );
}

export default ApiProxy;
