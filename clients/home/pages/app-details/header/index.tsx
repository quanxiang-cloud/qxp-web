import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import NavButton from '@portal/modules/apps-management/components/nav-button';
import toast from '@lib/toast';
import AppDropdown from '@c/app-dropdown';

import store from '../../store';
import './index.scss';

function DetailsHeader() {
  const history = useHistory();
  const { appID } = store;

  useEffect(() => {
    store.fetchAppList().then(() => {
      if (store.appList.findIndex(({ id }: AppInfo) => id === store.appID) === -1) {
        toast.error('应用不存在！2秒后跳转到首页');
        setTimeout(() => {
          history.replace('/')
        }, 2000);
      }
    });
  }, []);

  const handleChange = (newAppId: string) => {
    history.replace(location.pathname.replace(appID, newAppId));
  };

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        <NavButton {...{ name: '工作台', icon: 'add_task', inside: true, url: '/' }} />
        <span className='mr-16 ml-8'>/</span>
        <AppDropdown
          hiddenStatus={true}
          appList={store.appList}
          curApp={appID}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default observer(DetailsHeader);
