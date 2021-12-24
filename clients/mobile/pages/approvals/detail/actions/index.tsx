import React from 'react';
import { useSearchParam } from 'react-use';

import NavPage from '@m/components/nav-page';

export default function ApprovalsActions(): JSX.Element {
  const action = useSearchParam('action');

  return (
    <NavPage title={action ?? ''} absolute>
      <div style={{ marginTop: '.8rem' }}/>
      <p className='text-center text-placeholder'>
        Flow actions handle
      </p>
      <p className='text-center text-placeholder'>
        is now working in progress
      </p>
    </NavPage>
  );
}
