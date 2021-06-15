import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from './header';
import PageNav from './page-nav';
import PageDetails from './page-details';
import store from './store';

function AppDetails(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    store.fetchPageList(appID);
    return () => {
      store.clear();
    };
  }, [appID]);

  return (
    <div className='h-screen'>
      <Header />
      <div style={{ height: 'calc(100vh - 62px)' }} className='flex overflow-hidden'>
        <PageNav />
        <PageDetails />
      </div>
    </div>
  );
}

export default AppDetails;
