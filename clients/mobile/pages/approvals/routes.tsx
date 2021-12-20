import React from 'react';
import SubRoutePage from '@m/components/sub-route-page';
import { approvalDetailPath } from '@m/constant';
import Detail from './detail';
import Approvals from './tasks';

export default function Routes(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: approvalDetailPath, component: Detail }}>
      <Approvals />
    </SubRoutePage>
  );
}
