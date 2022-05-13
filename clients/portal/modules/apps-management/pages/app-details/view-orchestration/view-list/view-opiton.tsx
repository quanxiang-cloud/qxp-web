import React, { useMemo } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import MoreMenu, { MenuItem } from '@c/more-menu';

import './index.scss';
import { View } from '../types.d';

type Props = {
  view: View;
  className?: string;
  homeViewID?: string;
  onViewOptionClick?: (key: string, view: View) => void;
}

function ViewOption({ view, homeViewID, onViewOptionClick, className }: Props): JSX.Element {
  const menus: MenuItem<string>[] = useMemo(() => [
    {
      key: 'editView',
      disabled: false,
      label: (
        <div className="flex items-center">
          <Icon name="create" size={18} className="mr-8" />
          <span className="font-normal">修改名称</span>
        </div>
      ),
    },
    {
      key: 'setHomeView',
      disabled: homeViewID === view.id,
      label: (
        <div className="flex items-center">
          <Icon name="home" size={18} className="mr-8" />
          <span className="font-normal">设为应用主页</span>
        </div>
      ),
    },
    {
      key: 'delView',
      disabled: homeViewID === view.id,
      label: (
        <div className="flex items-center">
          <Icon name="restore_from_trash" size={18} className="mr-8" />
          <span className="font-normal">删除</span>
        </div>
      ),
    },

  ], [homeViewID, view]);

  return (
    <span className={cs('flex-shrink-0', className)}>
      <MoreMenu
        menus={menus}
        placement="bottom-end"
        onMenuClick={(key) => {
          onViewOptionClick?.(key, view);
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
}

export default ViewOption;
