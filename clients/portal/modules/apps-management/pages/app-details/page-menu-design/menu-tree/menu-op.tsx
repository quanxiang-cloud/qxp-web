import React, { useCallback } from 'react';
import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';

import { MenuType } from '../../type';

import './index.scss';

type Props = {
  menu: Menu;
  handleMenuClick?: (key: string, menu: Menu) => void;
}

const MenuOp = (props: Props): JSX.Element => {
  const getMenu = useCallback((menu: Menu): typeof MENUS => {
    const { isHide, menuType } = menu;
    const isPage = menuType !== MenuType.group;
    const isCustomPage = menuType === MenuType.customPage;

    const MENUS = [
      {
        key: isPage ? 'delPage' : 'delGroup',
        disabled: !isPage && (menu?.child?.length || 0) > 0,
        label: (
          <div className="flex items-center">
            <Icon name="restore_from_trash" size={16} className="mr-8" />
            <span className="font-normal">删除</span>
          </div>
        ),
      },
      {
        key: 'hide',
        disabled: !isPage,
        label: (
          <div className="flex items-center">
            <Icon name={isHide ? 'visibility' : 'visibility_off'} size={16} className="mr-8" />
            <span className="font-normal">{isHide ? '显示' : '隐藏'}</span>
          </div>
        ),
      },
    ];

    if (isPage) {
      MENUS.unshift(
        {
          key: 'editPage',
          disabled: false,
          label: (
            <div className="flex items-center">
              <Icon name="create" size={16} className="mr-8" />
              <span className="font-normal">编辑名称与图标</span>
            </div>
          ),
        },
        {
          key: 'copyPage',
          disabled: isCustomPage,
          label: (
            <div className="flex items-center">
              <Icon name="content_copy" size={16} className="mr-8" />
              <span className="font-normal">复制</span>
            </div>
          ),
        },
      );
    } else {
      MENUS.unshift({
        key: 'editGroup',
        disabled: false,
        label: (
          <div className="flex items-center">
            <Icon name="create" size={16} className="mr-8" />
            <span className="font-normal">修改分组名称</span>
          </div>
        ),
      });
    }

    return MENUS;
  }, []);

  const { menu, handleMenuClick } = props;

  return (
    <span className='flex-shrink-0'>
      <Icon
        changeable
        clickable
        className='mr-10 cursor-grab menu-item-drag'
        size={16}
        name='drag_indicator'
      />
      <MoreMenu
        menus={getMenu(menu)}
        placement="bottom-end"
        onMenuClick={(key) => {
          if (handleMenuClick) {
            handleMenuClick(key, menu);
          }
        }}
      >
        <Icon
          changeable
          clickable
          size={16}
          name='more_horiz'
        />
      </MoreMenu>
    </span>
  );
};

export default MenuOp;
