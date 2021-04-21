import React from 'react';
import { useLocation } from 'react-router-dom';

import IndexHeader from './index-header';
import './index.scss';

const HEADER_LIST = [
  { key: 'none', urls: ['/apps/formDesign', '/apps/details'] },
];

function getHeaderType(path:string) {
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
    return (<IndexHeader />);
  }
}

export default GlobalHeader;
