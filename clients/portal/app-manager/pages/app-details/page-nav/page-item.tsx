import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import MoreMenu, { MenuItem } from '@c/more-menu';
import { NodeRenderProps, TreeNode } from '@c/headless-tree/types';

type Props = NodeRenderProps<any> & {
  onMenuClick: (type: string, node: TreeNode<any>) => void;
}

function PageItem({ node, store, onMenuClick }: Props) {
  const isActive = store.currentFocusedNode.id === node.id;
  const isPage = node.children?.length === 0;

  const MENUS: MenuItem<string>[] = [
    isPage ?
      {
        key: 'editPage',
        label: (
          <div className="flex items-center">
            <Icon name="create" size={16} className="mr-8" />
            <span className="font-normal">修改名称与图标</span>
          </div>
        ),
      } : {
        key: 'editGroup',
        label: (
          <div className="flex items-center">
            <Icon name="create" size={16} className="mr-8" />
            <span className="font-normal">修改分组名称</span>
          </div>
        ),
      },
    {
      key: isPage ? 'delPage' : 'delGroup',
      label: (
        <div className="flex items-center">
          <Icon name="restore_from_trash" size={16} className="mr-8" />
          <span className="font-normal">删除</span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full justify-between pr-16 items-center">
      {isPage && (<Icon className='mr-8' name='settings' size={24} />)}
      <span className="truncate flex-1" title={node.name}>
        {node.name}
      </span>
      <div className={cs('opacity-0 group-hover:opacity-100', { 'opacity-100': isActive })}>
        {isPage && (<Icon className='mr-16 cursor-grab' name='drag_indicator' size={20} />)}
        <MoreMenu
          menus={MENUS}
          placement="bottom-end"
          onChange={(key: string) => onMenuClick(key, node)}
        >
          <Icon
            changeable
            clickable
            name='more_horiz'
          />
        </MoreMenu>
      </div>
    </div>
  );
}

export default React.memo(PageItem);
