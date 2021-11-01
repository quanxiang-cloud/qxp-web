
import React, { useEffect } from 'react';
import { Route, useParams } from 'react-router-dom';

import AppDetailsContent from './app-details-content';
import appDetailsStore from './store';

function AppDetails(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    appDetailsStore.fetchAppDetails(appID);
    return () => {
      appDetailsStore.clear();
    };
  }, [appID]);

  return (
    <div>
      <Route path='/apps/details/:appID/:menuType' component={AppDetailsContent} />
    </div>
  );
}

export default AppDetails;
