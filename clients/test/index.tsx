import React from 'react';

import NavigationMenu from './navigation-menu';

import { menus } from './constants';

function Test(): JSX.Element {
  return (
    <>
      <NavigationMenu
        menus={menus} mode="top"
        showExpandIcon={false}
        itemStyle={{ maxWidth: '140px' }}
        // activeClassName="bg-blue-300"
      />
      <div className="h-280 bg-indigo-300"></div>
      <NavigationMenu
        menus={menus}
        mode="side"
        style={{ maxWidth: '200px' }}
        // activeClassName="bg-blue-300"
      />
    </>
  );
}

export default Test;
