import React, { useState } from 'react';

import { ListMenu } from '@portal/pages/access-control/list-menu';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';

import RoleManagement from './role-management';
import MailList from './company-maillist';

export default function Index() {
  const [menuType, setMenuType] = useState('corporateDirectory');

  return (
    <div className="py-20 px-5-dot-8 flex justify-center items-start">
      <div className="w-31-dot-6 bg-white rounded-12">
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="访问控制"
            desc="对企业通讯录、角色权限进行统一管理"
            itemRender={
              <div
                className="bg-gradient-green-to-top-right
                icon-border-radius w-48 h-48 flex-initial
                flex items-center justify-center
                "
              >
                <img src="/dist/images/person.svg" alt="calendar" />
              </div>
            }
            titleClassName="text-2 leading-8 font-bold mb-2"
            descClassName="leading-8"
          />
        </div>
        <div className="p-8">
          <ListMenu defaultType="corporateDirectory" onChange={setMenuType} />
        </div>
      </div>
      <div className='w-20'></div>
      <div className="right-content-container">
        {menuType === 'corporateDirectory' && (<MailList />)}
        {menuType !== 'corporateDirectory' && (<RoleManagement />)}
      </div>
    </div>
  );
}
