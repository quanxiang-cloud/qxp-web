import React, { useState, useRef, useEffect } from 'react';

import { ListMenu } from '@portal/pages/access-control/list-menu';
import { ItemWithTitleDesc } from '@portal/components/Item-with-title-desc3';
import { HeaderWithMenu } from '@portal/components/header-with-menu2';

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
        <div className="w-31-dot-6 bg-white px-8 pt-8 pb-16 border-1-radius-2 mr-8">
          <ItemWithTitleDesc
            title="访问控制"
            desc="处理人员信息"
            itemRender={
              <div
                className="bg-gradient-green-to-top-right
                rounded-lg rounded-tr-none w-4-dot-8 h-4-dot-8 flex-initial
                flex items-center justify-center
                "
              >
                <img src="/dist/images/aces-ctl.svg" alt="calendar" />
              </div>
            }
            titleClassName="text-2 leading-8 font-bold mb-2"
            descClassName="leading-8"
          />
          <div className="h-10"></div>
          <ListMenu defaultType="corporateDirectory" onChange={setMenuType} />
        </div>
        <div className="w-988 bg-white border-1-radius-2 self-stretch flex flex-1">
          {menuType === 'corporateDirectory' && (<MailList />)}
          {menuType !== 'corporateDirectory' && (<RoleManagement />)}
        </div>
      </div>
    </>
  );
}
