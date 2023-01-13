import React from 'react';
import { useLocation } from 'react-router-dom';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';

const paths = [
  '/apps/formDesign',
  '/apps/details',
  '/apps/flow/',
  '/poly',
  '/apps/page-design',
];

function shouldHideHeader(currentPath: string): boolean {
  return paths.some((path) => currentPath.startsWith(path));
}

export default function GlobalHeader() {
  const { pathname } = useLocation();

  if (shouldHideHeader(pathname)) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center px-24 bg-white shadow-flow-header">
        <HeaderNav />
        <img
          className="h-40"
          src="/dist/images/enfi-logo-20230113.png"
          alt="quanxiangyun"
        />
        <HeaderMenu />
      </div>
    </>
  );
}
