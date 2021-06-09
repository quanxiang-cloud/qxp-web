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

const PADDING_PER_LEVEL = 16;

function getFirstPage(menus: ItemId[], source: Record<string, TreeItem>): PageInfo | undefined {
  for (const menuKey of menus) {
    const menu = source[menuKey];
    if (menu.data.menuType === 0) {
      return menu.data;
    } else {
      if (menu.hasChildren) {
        const firstPage: PageInfo | undefined = getFirstPage(menu.children, source);
        if (firstPage) {
          return firstPage;
        }
      }
    }
  }
}

const getIcon = (item: TreeItem) => {
  if (item.data.menuType === 0) {
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
  onSelectPage: (pageInfo: PageInfo) => void;
}

function NodeRender(
  { item, provided, onCollapse, onExpand, onMenuClick, isActive, onSelectPage }: NodeRenderProps,
): JSX.Element {
  const isPage = item.data.menuType === 0;

  const MENUS = [
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
      disabled: !isPage && item.children.length > 0,
    },
  ];
  function handleClick(): void {
    if (isPage) {
      onSelectPage(item.data);
      return;
    }

    item.isExpanded ? onCollapse(item.id) : onExpand(item.id);
  }

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <div
        className={cs('h-56', 'flex', 'items-center', 'px-18', 'group', 'hover:bg-gray-100', {
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
  onSelectPage: (pageInfo: PageInfo) => void;
  selectedPage?: PageInfo;
  tree: TreeData;
  onChange: (treeData: TreeData) => void;
}

export default class PureTree extends Component<Props> {
  componentDidMount() {
    const { tree } = this.props;
    if (!this.props.selectedPage?.id) {
      const firstPage = getFirstPage(tree.items.ROOT.children, tree.items);
      if (!firstPage) {
        return;
      }
      this.props.onSelectPage(firstPage);
      if (firstPage.groupID) {
        this.props.onChange(mutateTree(tree, firstPage.groupID, { isExpanded: true }));
      }
    } else {
      if (this.props.selectedPage.groupID) {
        this.props.onChange(mutateTree(tree, this.props.selectedPage.groupID, { isExpanded: true }));
      }
    }
  }

  onExpand = (itemId: ItemId) => {
    const { tree } = this.props;
    this.props.onChange(mutateTree(tree, itemId, { isExpanded: true }));
  };

  onCollapse = (itemId: ItemId) => {
    const { tree } = this.props;
    this.props.onChange(mutateTree(tree, itemId, { isExpanded: false }));
  };

  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    const { tree } = this.props;
    if (!destination || (destination.index === source.index && destination.parentId === source.parentId)) {
      return;
    }

    const treeItemID = tree.items[source.parentId].children[source.index];
    const treeItem = tree.items[treeItemID];
    const targetItem = tree.items[destination.parentId];

    if (destination.parentId !== 'ROOT' && (treeItem.data.menuType === 1 || targetItem.data.menuType === 0)) {
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

  render() {
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
