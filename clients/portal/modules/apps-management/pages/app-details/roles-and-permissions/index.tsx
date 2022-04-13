import React, { useState } from 'react';

import RoleNav from './role-nav';
import RoleDetails from './role-details';

import './index.scss';

function AppRoles(): JSX.Element {
  const [currentRole, setCurrentRole] = useState<RoleRight | undefined>(undefined);

  return (
    <div className="flex flex-col h-full flex-1 bg-white rounded-t-12 overflow-hidden">
      <div className='flex flex-1 w-full overflow-hidden'>
        <RoleNav setRole={setCurrentRole}/>
        <RoleDetails curRole={currentRole}/>
      </div>
    </div>
  );
}

export default AppRoles;
