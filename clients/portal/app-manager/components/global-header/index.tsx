import React from 'react';
import { useLocation } from 'react-router-dom';

import IndexHeader from './index-header';
import DetailsHeader from './details-header';
import './index.scss';

const HEADER_LIST = [
  { key: 'details', urls: ['/appManager/details', '/appManager/setting'] },
  { key: 'none', urls: ['/appManager/formDesign'] },
];

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
  case 'details':
    return (<DetailsHeader/>);

  case 'none':
    return null;

  default:
    return (<IndexHeader />);
  }
}

export default GlobalHeader;
