import React, { Component } from 'react';
import cs from 'classnames';
import Tree, {
  mutateTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
} from '@atlaskit/tree';

import Icon from '@c/icon';

const PADDING_PER_LEVEL = 16;

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

    return (
      <Tree
        isDragEnabled={false}
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
