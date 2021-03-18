import React, { useState } from 'react';

import { ListMenu } from '@portal/pages/accessControl/ListMenu';
import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc';
import { HeaderWithMenu } from '@portal/components/HeaderWithMenu';

import { RoleManagement } from './RoleManagement';
import { MailList } from './CompanyMailList';

export default function Index() {
  const [menuType, setMenuType] = useState('corporateDirectory');

  return (
    <>
      <HeaderWithMenu />
      <div
        className="py-3-dot-9 px-8 flex justify-center items-start"
      >
        <div className="w-316 bg-white pd-1 border-radius-2 mr-4">
          <ItemWithTitleDesc
            title="访问控制"
            desc="最近修改时间：2021-12-31 16:03"
            itemRender={
              <div className="p-dot-3-6 bg-gradient-green-to-top-right rounded-lg rounded-tr-none">
                <img src="/dist/images/aces-ctl.svg" alt="calendar" />
              </div>
            }
            titleClassName="text-dot-7 leading-4 font-bold"
            descClassName="leading-4"
          />
          <div className="h-5"></div>
          <ListMenu defaultType="corporateDirectory" onChange={setMenuType} />
        </div>
        <div className="w-988 h-auto bg-white border-radius-2">
          {menuType === 'corporateDirectory' ? <MailList visible /> : <RoleManagement visible />}
        </div>
      </div>
    </>
  );
}
