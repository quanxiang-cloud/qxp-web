import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';

import ForEmployee from './for-employee';

function PublishForm() {
  const { navType } = useParams<any>();
  const location = useLocation();

  const getUrl = (menuId: string) => {
    return location.pathname.replace(navType, menuId) + location.search;
  };

  const MENU = [
    {
      id: 'forEmployee',
      icon: 'people',
      replace: true,
      name: '对员工发布',
      url: getUrl('forEmployee'),
    },
  ];

  return (
    <div className="max-w-screen app-entry-container flex-1 w-full">
      <SideNavCard className='w-316' menuData={MENU} />
      <div className="app-right-box bg-white">
        {navType === 'forEmployee' && <ForEmployee />}
      </div>
    </div>
  );
}

export default PublishForm;
