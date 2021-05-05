import React from 'react';
import { useLocation } from 'react-router-dom';

import NormalHeader from './normal';

const paths = [
  '/apps/formDesign',
  '/apps/details',
  '/flow/new',
];

function shouldHideHeader(currentPath: string): boolean {
  return paths.some((path) => currentPath.startsWith(path));
}

export default function GlobalHeader() {
  const { pathname } = useLocation();
  if (shouldHideHeader(pathname)) {
    return null;
  }

  return (<NormalHeader />);
}
