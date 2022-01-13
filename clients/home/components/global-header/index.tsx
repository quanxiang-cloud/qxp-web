import React from 'react';
import { useLocation } from 'react-router-dom';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';

export default function GlobalHeader(): JSX.Element {
  const location = useLocation();
  if (location.pathname.startsWith('/apps')) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 px-24 bg-enfi-600 home-global-header">
        <HeaderNav />
        <img className="h-48" src="/dist/images/enfi-logo.png" alt="quanxiangyun"/>
        <HeaderMenu />
      </div>
    </>
  );
}
