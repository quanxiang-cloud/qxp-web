import React, { useState } from 'react';

import SettingNav from './setting-nav';
import AppInfo from './app-info';
import AppAdmin from './app-admin';

import './index.scss';

const NAV_LIST = [
  { name: '应用信息', key: 'appInfo' },
  { name: '应用管理员', key: 'appAdmin' },
  // { name: '工作流', key: 'workflow' },
];

function AppSetting() {
  const [nav, setNav] = useState('appInfo');

  return (
    <div className='flex h-full'>
      <SettingNav onChange={setNav} activeNav={nav} navList={NAV_LIST} />
      <div className='p-20 flex-1'>
        <p className='text-h5 mb-20'>
          {NAV_LIST.find(({ key })=>key===nav)?.name}
        </p>
        {nav === 'appInfo' && <AppInfo />}
        {nav === 'appAdmin' && <AppAdmin />}
      </div>
    </div>
  );
}

export default AppSetting;
