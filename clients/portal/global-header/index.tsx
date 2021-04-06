import React from 'react';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';

export default function GlobalHeader() {
  return (
    <>
      <div className="flex justify-between items-center py-8 px-24 bg-white">
        <HeaderNav />
        <img
          className="flex-1 h-46"
          src="/dist/images/quanxiangyun.svg"
          alt="quanxiangyun"
        />
        <HeaderMenu />
      </div>
    </>
  );
}
