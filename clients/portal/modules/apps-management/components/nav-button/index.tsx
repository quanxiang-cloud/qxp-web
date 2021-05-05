import React from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';

import './index.scss';

type Nav = {
  name: string | JSX.Element;
  icon: string;
  url?: string;
  inside?: boolean;
  active?: boolean;
}

function NavButton(nav: Nav) {
  const history = useHistory();

  const jump = (url: string | undefined, isInside: boolean | undefined) => {
    if (!url) {
      return;
    }

    if (isInside) {
      history.push(url);
      return;
    }

    window.location.href = url;
  };

  return (
    <div
      onClick={() => jump(nav.url, nav.inside)}
      className={cs(
        'app-nav-button icon-border-radius-8',
        { 'app-nav-button-active': nav.active }
      )}
    >
      <Icon size={20} className='mr-4 app-icon-color-inherit' name={nav.icon} />
      {nav.name}
    </div>
  );
}

export default NavButton;

