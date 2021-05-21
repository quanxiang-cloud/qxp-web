import React from 'react';
import { observer } from 'mobx-react';

import PageNav from './page-nav';
import PageDetails from './page-details';
import './index.scss';

function AppDetailsContent() {
  return (
    <div className='apps-management-height flex relative'>
      <PageNav />
      <PageDetails />
    </div>
  );
}

export default observer(AppDetailsContent);
