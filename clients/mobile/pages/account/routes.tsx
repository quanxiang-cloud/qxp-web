import React from 'react';

import SubRoutePage from '@m/components/sub-route-page';
import { changePwdPath, forgetPwdPath } from '@m/constant';

import ForgetPwd from './forget-pwd';
import AccountSecurity from './security';
import ChangePwd from './change-pwd';

function ChangePwdRoute(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: forgetPwdPath, component: ForgetPwd }}>
      <ChangePwd />
    </SubRoutePage>
  );
}

export default function Routes(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: changePwdPath, component: ChangePwdRoute, exact: false }}>
      <AccountSecurity />
    </SubRoutePage>
  );
}
