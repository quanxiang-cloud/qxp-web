import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Tab from '@c/tab';

import store from './store';
import RoleNav from './role-nav';
import DataSource from './model-source';
import AssociatedPerson from './associated-personnel';

import './index.scss';

function UsersAndPermissions(): JSX.Element {
  const { appID } = useParams<AppParams>();
  const [tabCurrentKey, setTabCurrentKey] = useState('associate');

  useEffect(() => {
    store.setAppID(appID);
    return () => {
      store.clear();
    };
  }, []);

  useEffect(() => {
    setTabCurrentKey('associate');
  }, [store.currentRole]);

  const tabItems = [
    {
      id: 'associate',
      name: '关联员工与部门',
      content: <AssociatedPerson />,
    },
    {
      id: 'datasource',
      name: '数据源权限',
      content: <DataSource />,
    },
  ];

  return (
    <div className="flex flex-col h-full flex-1 bg-white rounded-t-12 overflow-hidden">
      <div className='flex flex-1 w-full overflow-hidden'>
        <RoleNav/>
        <div className='authority-detail flex-1 pt-16 overflow-hidden w-1'>
          <Tab
            currentKey={tabCurrentKey}
            stretchNav={false}
            items={tabItems}
            className='w-full h-full rights-tab'
            navsClassName='tab-title'
            navTitleClassName="tab-label-item"
            contentClassName='m-16 mb-0'
            onChange={setTabCurrentKey}
          />
          <div className='rights-mes text-white'>
            <Icon name="people_alt" className='text-white mr-8' size={32} />
            <div>
              <div className='text-12 font-semibold'>{store.currentRole.name}</div>
              <div className='rights-des text-12' title={store.currentRole.description}>
                {store.currentRole.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(UsersAndPermissions);
