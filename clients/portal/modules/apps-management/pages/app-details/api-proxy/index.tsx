import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import List from './api-list';
import Add from './add-api';
import Detail from './api-detail';
import AddSwagger from './add-swagger';

import './styles.scss';

function ApiProxy() {
  const { path } = useRouteMatch();

  return (
    <div className='flex flex-grow bg-white mt-20 mx-20 api-proxy'>
      <Switch>
        <Route exact path={path} component={List} />
        <Route exact path={`${path}/:groupId`} component={List} />
        <Route exact path={`${path}/:groupId/add`} component={Add} />
        <Route exact path={`${path}/:groupId/:apiId/edit`} component={Add} />
        <Route exact path={`${path}/:groupId/add-swagger`} component={AddSwagger} />
        <Route path={`${path}/:groupId/:apiId`} component={Detail} />
      </Switch>
    </div>
  );
}

export default ApiProxy;
