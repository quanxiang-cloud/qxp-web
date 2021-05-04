import React from 'react';
import { useLocation } from 'react-router';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';

const HEADER_LIST = [
  { key: 'none', urls: ['/apps/formDesign', '/apps/details'] },
];

function IndexGlobalHeader() {
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

function getHeaderType(path: string) {
  for (const headers of HEADER_LIST) {
    for (const url of headers.urls) {
      if (path.startsWith(url)) {
        return headers.key;
      }
    }
  }
}

function GlobalHeader() {
  const location = useLocation();
  switch (getHeaderType(location.pathname)) {
  case 'none':
    return null;
  default:
    return (<IndexGlobalHeader />);
  }
}

export default GlobalHeader;
