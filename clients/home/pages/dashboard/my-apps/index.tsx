import React from 'react';

import MyAppsComponent from './demo-components/my-apps';
import AppInfoView from './demo-components/app-info-view';

import store from '../../store';
import { observer } from 'mobx-react';

function MyApps(): JSX.Element | null {
  if (!store.appList.length) {
    return null;
  }

  return (
    <MyAppsComponent apps={store.appList}>
      {store.appList.map((app) => {
        return (
          <AppInfoView key={app.id} appInfo={app} className="rounded-12 bg-white user-app-item" />
        );
      })}
    </MyAppsComponent>
  );
}

export default observer(MyApps);
