import React from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';

type Props = {
  name: string | JSX.Element;
  icon: string;
  url?: string;
  inside?: boolean;
  active?: boolean;
}

function HeaderNav(nav: Props): JSX.Element {
  const history = useHistory();

  const jump = (url: string | undefined, isInside: boolean | undefined): void => {
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
        'app-nav-button corner-8-8-8-2 p-6',
        { 'app-nav-button-active': nav.active },
      )}
    >
      <Icon size={20} className='mr-4 app-icon-color-inherit' name={nav.icon} />
      {nav.name}
    </div>
  );
}

export default HeaderNav;

