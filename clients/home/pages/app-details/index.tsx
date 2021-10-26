import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import PageNav from './page-nav';
import PageDetails from './page-details';
import store from './store';

import './index.scss';

function AppDetails(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    store.fetchPageList(appID);
    return () => {
      store.clear();
    };
  }, [appID]);

  function handleShowPageNav(e: React.MouseEvent): void {
    if (store.isMouseControl) {
      if (e.clientX <= 0) {
        store.openPageNav();
      } else if (e.clientX > 224) {
        store.closePageNav();
      }
    }
  }

  return (
    <div className='main-content-without-header flex' onMouseMove={handleShowPageNav}>
      <PageNav />
      <PageDetails />
    </div>
  );
}

export default observer(AppDetails);
