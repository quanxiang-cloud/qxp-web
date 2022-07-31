import React from 'react';
import type { Node } from '@one-for-all/artery';

import type { PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import type { ItemRenderProps } from '@c/visual-scroll-list';

import ComponentRender from '../component-render';

interface Props extends ItemRenderProps<PackageComponent> {
  onAddNode: (node: Node) => void;
  componentWidth: number;
  tupleNumber: number;
  gap: number;
}

function SearchResultListItem(props: Props): JSX.Element {
  const { item: component, className, style, index, onAddNode, componentWidth, tupleNumber, gap } = props;

  return (
    <ComponentRender
      {...component}
      key={component.name}
      onAddNode={onAddNode}
      className={className}
      style={{
        ...style,
        width: componentWidth,
        left: (index % tupleNumber) * (gap + componentWidth),
      }}
    />
  );
}

export default SearchResultListItem;
