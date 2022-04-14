import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Tab from '@c/tab';

import store from './store';
import AssociatedPerson from './associated-personnel';
import APIAuth from './api-auth';

type Props = {
  curRole: RoleRight | undefined
}

function RoleDetails({ curRole }: Props): JSX.Element {
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.setAppID(appID);
    return () => {
      store.clear();
    };
  }, []);

  useEffect(() => {
    curRole && store.setRole(curRole);
  }, [curRole]);

  const tabItems = [
    {
      id: 'associate',
      name: '关联员工与部门',
      content: <AssociatedPerson />,
    },
    {
      id: 'datasource',
      name: '数据源权限',
      content: <APIAuth />,
    },
  ];

  return (
    <div className='authority-detail flex-1 pt-16 overflow-hidden w-1'>
      <Tab
        stretchNav={false}
        items={tabItems}
        className='w-full h-full rights-tab'
        navsClassName='tab-title'
        navTitleClassName="tab-label-item"
        contentClassName='m-16 mb-0'
      />
      <div className='rights-mes text-white'>
        <Icon name="people_alt" className='text-white mr-8' size={32} />
        <div>
          <div className='text-12 font-semibold'>{curRole?.name || ''}</div>
          <div className='rights-des text-12' title={curRole?.description || ''}>
            {curRole?.description || ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(RoleDetails);
