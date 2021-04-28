import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Avatar from '@c/avatar';
import Card from '@c/card';
import AppInfoView from '@appC/app-info-view';

import store from '../store';

import './index.scss';

function Dashboard() {
  const history = useHistory();

  useEffect(() => {
    document.title = '工作台';
    store.fetchAppList();
  }, []);

  return (
    <>
      <main className="py-40 px-58 relative"
        style={{ height: 'calc(100vh - 62px)', overflow: 'scroll' }}>
        <div className="absolute top-42 right-64 -z-z-1 w-214 h-160">
          <img src="/dist/images/work-figure.svg" alt="dashboard" />
        </div>
        <Avatar
          username={window.USER.userName}
          bio="不是杰出者才能做梦，而是善梦者才杰出"
          avatar=''
        />
        <div className="px-6 mt-40">
          <Card
            className="px-32 py-20"
            headerClassName="ml-8"
            title="我的应用"
            itemTitleClassName="text-h5"
            content={
              (
                <div className='flex flex-wrap gap-20'>
                  {store.appList.map((appInfo: AppInfo) => (
                    <AppInfoView
                      onClick={() => history.push('/appDetails/' + appInfo.id)}
                      className='rounded-12 bg-white user-app-item'
                      key={appInfo.id}
                      appInfo={appInfo}
                    />
                  ))}
                </div>
              )
            }
          />
        </div>
      </main>
    </>
  );
}

export default observer(Dashboard);
