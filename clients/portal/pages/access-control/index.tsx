import React, { useState, useRef, useEffect } from 'react';

import { ListMenu } from '@portal/pages/access-control/list-menu';
import { ItemWithTitleDesc } from '@portal/components/Item-with-title-desc';
import { HeaderWithMenu } from '@portal/components/header-with-menu';

import RoleManagement from './role-management';
import MailList from './company-maillist';

export default function Index() {
  const [menuType, setMenuType] = useState('corporateDirectory');
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current && mainRef.current) {
      mainRef.current.style.minHeight = `calc(100vh - ${
        getComputedStyle(headerRef.current).height
      })`;
    }
  });

  return (
    <>
      <HeaderWithMenu ref={headerRef} />
      <div
        className="py-3-dot-9 px-8 flex justify-center items-start"
        ref={mainRef}
      >
        <div className="w-316 bg-white pd-1 border-radius-2 mr-4">
          <ItemWithTitleDesc
            title="访问控制"
            desc="最近修改时间：2021-12-31 16:03"
            itemRender={
              <div
                className="p-dot-3-6 bg-gradient-green-to-top-right
                rounded-lg rounded-tr-none w-2dot4 h-2dot4 flex-initial"
              >
                <img src="/dist/images/aces-ctl.svg" alt="calendar" />
              </div>
            }
            titleClassName="text-dot-7 leading-4 font-bold"
            descClassName="leading-4"
          />
          <div className="h-5"></div>
          <ListMenu defaultType="corporateDirectory" onChange={setMenuType} />
        </div>
        <div className="w-988 bg-white border-radius-2 self-stretch flex flex-1">
          {menuType === 'corporateDirectory' && (<MailList />)}
          {menuType !== 'corporateDirectory' && (<RoleManagement />)}
        </div>
      </div>
    </>
  );
}
