import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Error from '@c/error';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';

const Message=lazy(()=> import('./message'));
const SendMessage=lazy(()=> import('./send-message'));

export default function Index() {
  const [{ userInfo }] = usePortalGlobalValue();
  const { path }=useRouteMatch();

  // todo: 确定具体的authority?
  if (!userInfo.authority.includes('platform')) {
    return <Error desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <Switch>
      <Route exact path={`${path}`} component={Message} />
      <Route path={`${path}/message`} component={Message} />
      <Route path={`${path}/message/send`} component={SendMessage} />
      <Route component={() => (<Error desc={'Menu page is not found'} />)} />
    </Switch>
  );
}
