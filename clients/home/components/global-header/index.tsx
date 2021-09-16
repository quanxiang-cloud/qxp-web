import React from 'react';
import { useLocation } from 'react-router-dom';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';

export default function GlobalHeader() {
  const location = useLocation();
  if (location.pathname.startsWith('/apps')) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 px-24 bg-white home-global-header">
        <HeaderNav />
        <img
          className="flex-1 h-48"
          src="/dist/images/enfei/enfei-china.png"
          alt="quanxiangyun"
        />
        <HeaderMenu />
      </div>
    </>
  );
}
