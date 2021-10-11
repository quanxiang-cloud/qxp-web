import React, { Component } from 'react';
import cs from 'classnames';
import { isNumber } from 'lodash';
import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';

import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';
import toast from '@lib/toast';

import { movePage } from '../api';
import { MenuType } from '../type';

const PADDING_PER_LEVEL = 16;

export function getFirstPageItem(menus: ItemId[], source: Record<string, TreeItem>): TreeItem | undefined {
  for (const menuKey of menus) {
    const menu = source[menuKey];
    if (menu.data.menuType !== MenuType.group) {
      return menu;
    } else {
      if (menu.hasChildren) {
        const firstPageItem: TreeItem | undefined = getFirstPageItem(menu.children, source);
        if (firstPageItem) {
          return firstPageItem;
        }
      }
    }
  }
}

export function getNextTreeItem(
  treeItem: TreeItem, source: Record<string, TreeItem>,
): TreeItem | undefined {
  const rootItemKeys = source.ROOT.children;

  if (rootItemKeys.includes(treeItem.id)) {
    if (!treeItem.hasChildren) {
      return getNextItem(treeItem, rootItemKeys, source);
    }

    return;
  }

  const fatherChildKeys = source[treeItem.data.groupID].children;
  return getNextItem(treeItem, fatherChildKeys, source);
}

function getNextItem(
  treeItem: TreeItem, itemKeys: ItemId[], source: Record<string, TreeItem>,
): TreeItem | undefined {
  const deleteItemIndex = itemKeys.indexOf(treeItem.id as string);
  const lastItemIndex = itemKeys.length - 1;
  let nextRootItem: TreeItem | undefined;

  if (deleteItemIndex === lastItemIndex) {
    nextRootItem = getFirstPageItem(itemKeys, source);
    if (nextRootItem && treeItem.data.groupID) {
      const fatherItem = source[treeItem.data.groupID];
      return getNextItem(fatherItem, source.ROOT.children, source);
    }
    return nextRootItem;
  }

  nextRootItem = getFirstPageItem(itemKeys.slice(deleteItemIndex + 1), source);
  return nextRootItem;
}

const getIcon = (item: TreeItem): JSX.Element => {
  if (item.data.menuType !== MenuType.group) {
    // todo should has an default icon name
    return (<Icon className='mr-8 text-current flex-shrink-0' name={item.data.icon} size={24} />);
  }

  if (item.isExpanded) {
    return (<Icon className='mr-8 text-current flex-shrink-0' name="arrow_drop_up" size={24} />);
  }

  return (<Icon className='mr-8 text-current flex-shrink-0' name="arrow_drop_down" size={24} />);
};

type NodeRenderProps = RenderItemParams & {
  onMenuClick: (key: string, treeItem: TreeItem) => void;
  isActive: boolean;
  onSelectPage: (treeItem: TreeItem) => void;
}

function NodeRender(
  { item, provided, onCollapse, onExpand, onMenuClick, isActive, onSelectPage }: NodeRenderProps,
): JSX.Element {
  const isPage = item.data.menuType !== MenuType.group;
  const isHide = item.data.isHide;
  const isCustomPage = item.data.menuType === MenuType.customPage;

  const MENUS = [
    {
      key: isPage ? 'delPage' : 'delGroup',
      disabled: !isPage && item.children.length > 0,
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
          <Icon name="visibility" size={16} className="mr-8" />
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

  function handleClick(): void {
    if (isPage) {
      onSelectPage(item);
      return;
    }

    item.isExpanded ? onCollapse(item.id) : onExpand(item.id);
  }
  provided.draggableProps.style.paddingLeft = item.data.groupID ? '28px' : '0px';

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <div
        className={cs('h-40', 'flex', 'items-center', 'px-18', 'group', 'hover:bg-gray-100', {
          'app-page-tree-node-tail': isActive,
          'text-blue-600': isActive,
        })}
        onClick={handleClick}
      >
        {getIcon(item)}
        <span className="truncate">{item.data ? item.data.name : ''}</span>
        <div
          className={cs('ml-auto opacity-0 group-hover:opacity-100 flex-shrink-0', {
            'opacity-100': isActive,
          })}
        >
          {isPage && (<Icon className='mr-16 cursor-grab' name='drag_indicator' size={20} />)}
          <MoreMenu
            menus={MENUS}
            placement="bottom-end"
            onMenuClick={(key) => onMenuClick(key, item)}
          >
            <Icon
              changeable
              clickable
              name='more_horiz'
            />
          </MoreMenu>
        </div>
      </div>
    </div>
  );
}

type Props = {
  onMenuClick: (key: string, treeItem: TreeItem) => void;
  onSelectPage: (treeItem: TreeItem) => void;
  selectedPage?: PageInfo;
  tree: TreeData;
  onChange: (treeData: TreeData) => void;
}

export default class PureTree extends Component<Props> {
  componentDidMount(): void {
    const { tree } = this.props;
    if (!this.props.selectedPage?.id) {
      const firstPageItem = getFirstPageItem(tree.items.ROOT.children, tree.items);
      if (!firstPageItem) {
        return;
      }
      this.props.onSelectPage(firstPageItem);
      if (firstPageItem.data.groupID) {
        this.props.onChange(mutateTree(tree, firstPageItem.data.groupID, { isExpanded: true }));
      }
    } else {
      this.props.onSelectPage(tree.items[this.props.selectedPage?.id]);
      if (this.props.selectedPage.groupID) {
        this.props.onChange(mutateTree(tree, this.props.selectedPage.groupID, { isExpanded: true }));
      }
    }
  }

  componentDidUpdate(prevProps: any): void {
    const { selectedPage, tree } = this.props;

    if (prevProps.selectedPage !== selectedPage) {
      if (selectedPage?.id) {
        if (selectedPage?.groupID) {
          this.props.onChange(
            mutateTree(tree, selectedPage.groupID as string, { isExpanded: true }),
          );
        }
        this.props.onSelectPage(tree.items[selectedPage.id]);
      }
    }
  }

  onExpand = (itemId: ItemId): void => {
    const { tree } = this.props;
    this.props.onChange(mutateTree(tree, itemId, { isExpanded: true }));
  };

  onCollapse = (itemId: ItemId): void => {
    const { tree } = this.props;
    this.props.onChange(mutateTree(tree, itemId, { isExpanded: false }));
  };

  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ): void => {
    const { tree } = this.props;
    if (!destination || (destination.index === source.index && destination.parentId === source.parentId)) {
      return;
    }

    const treeItemID = tree.items[source.parentId].children[source.index];
    const treeItem = tree.items[treeItemID];
    const targetItem = tree.items[destination.parentId];

    if (destination.parentId !== 'ROOT' && (
      treeItem.data.menuType === MenuType.group ||
      targetItem.data.menuType === MenuType.schemaForm ||
      targetItem.data.menuType === MenuType.customPage
    )) {
      return;
    }

    destination.index = destination.index || 0;
    const newTree = moveItemOnTree({ ...tree }, source, destination);
    this.props.onChange(newTree);

    const fromGroupID = source.parentId === 'ROOT' ? '' : source.parentId;
    const toGroupID = destination.parentId === 'ROOT' ? '' : destination.parentId;
    movePage({
      id: treeItem.id as string,
      Name: treeItem.data.name,
      appID: treeItem.data.appID,
      fromSort: source.index + 1,
      toSort: isNumber(destination.index) ? destination.index + 1 : 1,
      fromGroupID: fromGroupID as string,
      toGroupID: toGroupID as string,
    }).catch((err) => {
      toast.error('移动页面位置失败:', err.data.msg);
    });
  };

  render(): JSX.Element {
    const { tree, selectedPage } = this.props;

    return (
      <Tree
        isDragEnabled
        isNestingEnabled
        tree={tree}
        onExpand={this.onExpand}
        onCollapse={this.onCollapse}
        onDragEnd={this.onDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        renderItem={(renderItemProps) => {
          return (
            <NodeRender
              {...renderItemProps}
              onMenuClick={this.props.onMenuClick}
              isActive={selectedPage?.id === renderItemProps.item.id}
              onSelectPage={this.props.onSelectPage}
            />
          );
        }}
      />
    );
  }
}
