import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from './header';
import PageNav from './page-nav';
import PageDetails from './page-details';
import store from '../store';

function AppDetails() {
  const { appID } = useParams<any>();

  useEffect(() => {
    store.fetchPageList(appID);
    return () => {
      store.clear();
    };
  }, [appID]);

  return (
    <div className='flex flex-col h-screen overflow-y-hidden'>
      <Header />
      <div className='flex-1 flex overflow-hidden'>
        <PageNav />
        <PageDetails />
      </div>
    </div>
  );
}

export default AppDetails;
