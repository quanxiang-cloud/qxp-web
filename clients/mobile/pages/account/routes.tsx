import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import { pathPrefix } from '@m/routes';

export const accountSecurityPath = `${pathPrefix}/account/security`;
export const changePwdPath = `${pathPrefix}/account/change-pwd`;
export const forgetPwdPath = `${pathPrefix}/account/security`;

const AccountSecurity = lazy(
  () => import('./security'),
);

const ChangePwd = lazy(
  () => import('./change-pwd'),
);

const ForgetPwd = lazy(
  () => import('./forget-pwd'),
);

export default function AccountRoutes(): JSX.Element {
  return (
    <Switch>
      <Route exact path={accountSecurityPath} component={AccountSecurity} />
      <Route exact path={changePwdPath} component={ChangePwd} />
      <Route exact path={forgetPwdPath} component={ForgetPwd} />
    </Switch>
  );
}
