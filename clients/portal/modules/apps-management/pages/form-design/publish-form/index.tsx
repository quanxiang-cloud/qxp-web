import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';

function PublishForm() {
  const { navType } = useParams<FormDesignParams>();
  const location = useLocation();

  const getUrl = (menuId: string) => {
    return location.pathname.replace(navType as string, menuId) + location.search;
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
    <div className="app-entry-container flex-1 w-full px-58">
      <SideNavCard className='w-316' menuData={MENU} />
      <div className="app-right-box bg-white">
      </div>
    </div>
  );
}

export default PublishForm;
