import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';

import store from './store';
import { NodeItem } from '@c/two-level-menu';

const ROLE_TOOlS: Record<string, {title: string, icon: string}> = {
  edit: { title: '修改信息', icon: 'create' },
  copy: { title: '复制角色', icon: 'content_copy' },
  delete: { title: '删除角色', icon: 'restore_from_trash' },
};

type Props = {
  role: NodeItem<RoleRight>
}

function RoleMenu({ role }: Props ): JSX.Element {
  const menus = Object.keys(ROLE_TOOlS).map((key) => {
    const _MenuLabel = (
      <div className="flex items-center" key={key}>
        <Icon name={ROLE_TOOlS[key].icon} size={16} className="mr-8" />
        <span className="font-normal">{ROLE_TOOlS[key].title}</span>
      </div>
    );
    return { key, label: _MenuLabel };
  });

  return (
    <MoreMenu
      // menus={role.source?.type === Role.DEFAULT ? menus.slice(0, 1) : menus}
      menus={menus}
      placement="bottom-end"
      onMenuClick={store.setModalType}
    >
      <Icon
        changeable
        clickable
        name='more_horiz'
      />
    </MoreMenu>
  );
}

export default observer(RoleMenu);
