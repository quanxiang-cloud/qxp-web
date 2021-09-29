import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';

import store from './store';

interface Props {
  tabKey: string;
}

const listItem = [
  { key: 'copy', label: '复制', icon: 'content_copy' },
  { key: 'edit', label: '修改信息', icon: 'create' },
  { key: 'delete', label: '删除选项集', icon: 'restore_from_trash' },
];

const listMenus = listItem.map((itm) => {
  return ({
    key: itm.key,
    label: (
      <>
        <span className='pr-10'>
          <Icon name={itm.icon} />
        </span>
        <span>{itm.label}</span>
      </>
    ),
  });
});

const treeMenus = listMenus.slice(1);

function MoreIconMenu({ tabKey }: Props): JSX.Element {
  return (
    <MoreMenu
      className="action-more mr-10"
      onMenuClick={(key: string) => {
        store.modalType = key;
        store.modalOpen = true;
      }}
      menus={tabKey === 'list' ? listMenus : treeMenus}
      placement='bottom-end'
    />
  );
}

export default observer(MoreIconMenu);
