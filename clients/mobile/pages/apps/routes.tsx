import React from 'react';

import { appsPageDetailPath } from '@m/constant';
import SubRoutePage from '@m/components/sub-route-page';

import PageDetail from './page-detail';
import AppDetail from './app-detail';

export default function Routes(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: appsPageDetailPath, component: PageDetail }}>
      <AppDetail />
    </SubRoutePage>
  );
}
