import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import NavButton from '@appC/nav-button';

import AppDropdown from '@c/app-dropdown';

import store from '../../store';
import './index.scss';

function DetailsHeader() {
  const history = useHistory();
  useEffect(() => {
    store.fetchAppList();
  }, []);

  const handleChange = (newAppId:string) => {
    history.replace(location.pathname.replace(store.appID, newAppId));
  };

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        <NavButton {...{ name: '工作台', icon: 'add_task', inside: true, url: '/' }} />
        <span className='mr-16 ml-8'>/</span>
        <AppDropdown
          hiddenStatus={true}
          appList={store.appList}
          curApp={store.appID}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default observer(DetailsHeader);
