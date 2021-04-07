import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import cs from 'classnames';

import Icon from '@c/icon';

import IndexHeader from './index-header';
import DetailsHeader from './details-header';
import './index.scss';

const DETAILS_HEADER = ['/appManager/details','/appManager/setting'];
const INDEX_HEADER = ['/appManager/list'];

function GlobalHeader() {
  const history = useHistory();
  const location = useLocation();
  const isIndexHeader = INDEX_HEADER.includes(location.pathname);

  const jump = (url: string, isInside: boolean | undefined) => {
    if (!url) {
      return;
    }

    if (isInside) {
      history.push(url);
      return;
    }

    window.location.href = url;
  };

  const navButtonRender = (nav: any) => {
    return (
      <div
        onClick={() => jump(nav.url, nav.inside)}
        className={cs('app-global-header-nav icon-border-radius-8',
          { 'app-nav-active': nav.active })}
        key={nav.name}
      >
        <Icon size={20} className='mr-4 app-icon-color-inherit' name={nav.icon} />
        {nav.name}
      </div>
    );
  };

  if (isIndexHeader) {
    return (<IndexHeader navButtonRender={navButtonRender} />);
  }

  return (<DetailsHeader navButtonRender={navButtonRender} />);
}

export default GlobalHeader;
