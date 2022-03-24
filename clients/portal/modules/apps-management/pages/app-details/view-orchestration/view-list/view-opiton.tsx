import React from 'react';
import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';

import './index.scss';
import { View } from '../types.d';

type Props = {
  view: View;
  onViewOptionClick?: (key: string, view: View) => void;
}

const MENUS = [
  {
    key: 'editPage',
    disabled: false,
    label: (
      <div className="flex items-center">
        <Icon name="create" size={16} className="mr-8" />
        <span className="font-normal">编辑名称</span>
      </div>
    ),
  },
  {
    key: 'delView',
    label: (
      <div className="flex items-center">
        <Icon name="restore_from_trash" size={16} className="mr-8" />
        <span className="font-normal">删除</span>
      </div>
    ),
  },
];

function ViewOption({ view, onViewOptionClick }: Props): JSX.Element {
  return (
    <span className='flex-shrink-0'>
      <MoreMenu
        menus={MENUS}
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
