import React from 'react';
import { useParams } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';

import ForEmployee from './for-employee';

function PublishForm() {
  const { pageId, navType } = useParams<any>();

  const basicUrl = `/apps/formDesign/publishForm/${pageId}/`;
  const MENU = [
    {
      id: 'forEmployee',
      icon: 'people',
      replace: true,
      name: '对员工发布',
      url: basicUrl + 'forEmployee',
    },
  ];
  return (
    <div className="max-w-screen app-entry-container flex-1 w-full">
      <SideNavCard menuData={MENU} />
      <div className="app-right-box bg-white">
        {navType === 'forEmployee' && <ForEmployee />}
      </div>
    </div>
  );
}

export default PublishForm;
