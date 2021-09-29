import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import ErrorTips from '@c/error-tips';

const Message = lazy(() => import('./message'));
const SendMessage = lazy(() => import('./send-message'));
const MessageDetails = lazy(() => import('./message-details'));
const Log = lazy(() => import('./audit-log'));
const UnusualTask = lazy(() => import('./unusual-task'));
const UnusualTaskDetail = lazy(() => import('./unusual-task/detail'));

export default function Index(): JSX.Element {
  const { path } = useRouteMatch();

  // todo: 确定具体的authority?
  if (!window.ADMIN_USER_FUNC_TAGS.includes('platform')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="您没有权限, 请联系管理员..."
      />
    );
  }

  return (
    <Switch>
      <Route exact path={`${path}/message`} component={Message} />
      <Route exact path={`${path}/log`} component={Log} />
      <Route path={`${path}/message/send`} component={SendMessage} />
      <Route path={`${path}/message/details/:id`} component={MessageDetails} />
      <Route
        path={`${path}/unusual/detail/:id/:status/:processInstanceId/:taskId/:flowInstanceId`}
        component={UnusualTaskDetail} />
      <Route path={`${path}/unusual`} component={UnusualTask} />
      <Redirect from={path} to={`${path}/message`} />
      <Route component={(): JSX.Element => (<ErrorTips desc={'Menu page is not found'} />)} />
    </Switch>
  );
}
