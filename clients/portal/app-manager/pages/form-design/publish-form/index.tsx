import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';

import ForEmployee from './for-employee';

const MENU = [
  {
    id: 'forEmployee',
    icon: 'people',
    replace: true,
    name: '对员工发布',
    url: '/appManager/formDesign/publishForm/forEmployee',
  },
];

function PublishForm() {
  return (
    <div className="max-w-screen app-entry-container flex-1 w-full">
      <SideNavCard menuData={MENU} />
      <div className="app-right-box bg-white">
        <Switch>
          <Route
            exact
            path="/appManager/formDesign/publishForm/forEmployee"
            component={ForEmployee}
          />
        </Switch>
      </div>
    </div>
  );
}

export default PublishForm;
