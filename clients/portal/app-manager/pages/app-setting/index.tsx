import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { inject } from 'mobx-react';

import SettingNav from './setting-nav';
import AppInfo from './app-info';
import AppAdmin from './app-admin';

import './index.scss';

type Props = {
  appDetailsStore?: any;
}

const NAV_LIST = [
  { name: '应用信息', key: 'appInfo' },
  { name: '应用管理员', key: 'appAdmin' },
  // { name: '工作流', key: 'workflow' },
];

function AppSetting({ appDetailsStore }: Props) {
  const { appId } = useParams<any>();
  const [nav, setNav] = useState('appInfo');

  useEffect(() => {
    appDetailsStore.setAppId(appId);
  }, [])

  return (
    <div className='flex h-full'>
      <SettingNav onChange={setNav} activeNav={nav} navList={NAV_LIST} />
      <div className='p-20 flex-1'>
        <p className='text-h5 mb-20'>
          {NAV_LIST.find(({ key }) => key === nav)?.name}
        </p>
        {nav === 'appInfo' && <AppInfo />}
        {nav === 'appAdmin' && <AppAdmin />}
      </div>
    </div>
  );
}

export default inject('appDetailsStore')(AppSetting);
