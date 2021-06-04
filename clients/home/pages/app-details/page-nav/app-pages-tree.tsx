import React, { Component } from 'react';
import cs from 'classnames';
import Tree, {
  mutateTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
} from '@atlaskit/tree';

import AbsoluteCentered from '@c/absolute-centered';
import Icon from '@c/icon';

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
  isActive: boolean;
  onSelectPage: (pageInfo: PageInfo) => void;
}

function NodeRender(
  { item, provided, onCollapse, onExpand, isActive, onSelectPage }: NodeRenderProps
): JSX.Element {
  const isPage = item.data.menuType === 0;

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
          'cursor-pointer': !isActive,
        })}
        onClick={handleClick}
      >
        {getIcon(item)}
        <span className="truncate">{item.data ? item.data.name : ''}</span>
      </div>
    </div>
  );
}

type Props = {
  onSelectPage: (pageInfo: PageInfo) => void;
  selectedPage?: PageInfo;
  tree: TreeData;
}

export default class PureTree extends Component<Props, { tree: TreeData }> {
  constructor(props: Props) {
    super(props);

    this.state = { tree: this.props.tree };
  }

  componentDidMount() {
    const { tree } = this.props;
    if (!this.props.selectedPage?.id) {
      const firstPage = getFirstPage(tree.items.ROOT.children, tree.items);
      if (!firstPage) {
        return;
      }

      this.props.onSelectPage(firstPage);
      if (firstPage.groupID) {
        this.setState({
          tree: mutateTree(tree, firstPage.groupID, { isExpanded: true }),
        });
      }
    } else {
      if (this.props.selectedPage.groupID) {
        this.setState({
          tree: mutateTree(tree, this.props.selectedPage.groupID, { isExpanded: true }),
        });
      }
    }
  }

  onExpand = (itemId: ItemId) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId: ItemId) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  render() {
    const { tree } = this.state;
    const { selectedPage } = this.props;

    if (tree.items.ROOT.hasChildren === false) {
      return (
        <AbsoluteCentered>
          <div className='app-no-data'>
            <img src='/dist/images/empty-tips.svg' />
          </div>
        </AbsoluteCentered>
      );
    }

    return (
      <Tree
        isDragEnabled
        tree={tree}
        onExpand={this.onExpand}
        onCollapse={this.onCollapse}
        offsetPerLevel={PADDING_PER_LEVEL}
        renderItem={(renderItemProps) => {
          return (
            <NodeRender
              {...renderItemProps}
              isActive={selectedPage?.id === renderItemProps.item.id}
              onSelectPage={this.props.onSelectPage}
            />
          );
        }}
      />
    );
  }
}
