import React from 'react';
import SubRoutePage from '@m/components/sub-route-page';
import AccountSecurity from './security';
import ChangePwd from './change-pwd';
import { changePwdPath } from '@m/constant';

export default function Account(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: changePwdPath, component: ChangePwd, exact: false }}>
      <AccountSecurity />
    </SubRoutePage>
  );
}
