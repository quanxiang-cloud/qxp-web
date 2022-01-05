import React from 'react';

import SubRoutePage from '@m/components/sub-route-page';
import { approvalActionPath, approvalDetailPath, approvalStatusPath } from '@m/constant';
import ApprovalsActions from '@m/pages/approvals/detail/actions';
import { SubRoute } from '@m/lib/hooks/use-sub-route';

import Detail from './detail';
import Approvals from './tasks';
import StatusDetail from './detail/status-detail';

const DETAIL_ROUTES: SubRoute[] = [
  { path: approvalActionPath, component: ApprovalsActions },
  { path: approvalStatusPath, component: StatusDetail },
];

function DetailRoute(): JSX.Element {
  return (
    <SubRoutePage subRoutes={DETAIL_ROUTES}>
      <Detail />
    </SubRoutePage>
  );
}

export default function Routes(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: approvalDetailPath, component: DetailRoute, exact: false }}>
      <Approvals />
    </SubRoutePage>
  );
}
