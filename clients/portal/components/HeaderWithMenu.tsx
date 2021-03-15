import React, { useState, useRef } from 'react';

import { Header } from './Header';
import { Menu } from './Menu';

export const HeaderWithMenu = React.memo(() => {
  const [showMenu, setShowMenu] = useState<boolean | null>(null);
  const headerSetterRef = useRef<Function>();

  const menus = [
    {
      iconClassName: 'bg-gradient-green-to-top-right',
      iconUrl: '/dist/images/calendar.svg',
      title: '应用管理',
      desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
      address: '/dist/images/calendar.svg',
    },
    {
      iconClassName: 'bg-gradient-yellow-to-top-right',
      iconUrl: '/dist/images/accounts.svg',
      title: '访问控制',
      desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
      address: '/accessControl',
    },
    {
      iconClassName: 'bg-gradient-blue-to-top-right',
      iconUrl: '/dist/images/add.svg',
      title: '平台设置',
      desc: '对平台的企业空间、账号、以及角色权限进行统一管理。',
      address: '/dist/images/add.svg',
    },
  ];

  const onToggle = (show: boolean) => {
    setShowMenu(show);
    headerSetterRef.current && headerSetterRef.current(show);
  };

  return (
    <>
      <Header onMenuToggle={setShowMenu} getSetter={(f) => (headerSetterRef.current = f)} />
      <Menu menus={menus} visible={showMenu} toggle={onToggle} />
    </>
  );
});
