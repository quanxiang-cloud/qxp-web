import React, { useRef, useCallback } from 'react';

import { PackageComponent } from '@pageDesign/blocks/menu/type';
import VisualScrollList, {
  RefProps,
  useUpdateVisualScrollList,
  ItemRenderProps,
} from '@c/visual-scroll-list';

import SearchResultListItem from './search-result-list-item';

export interface Props {
  viewportHeight: number;
  components: PackageComponent[];
  tupleNumber: number;
  gap: number;
  onAddNode: () => void;
  componentWidth: number;
}

const SearchResultList = (props: Props): JSX.Element => {
  const { viewportHeight, components, tupleNumber, gap, onAddNode, componentWidth } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<RefProps>(null);

  useUpdateVisualScrollList(listRef, containerRef);

  const render = useCallback((props: ItemRenderProps<PackageComponent>) => (
    <SearchResultListItem
      {...props}
      onAddNode={onAddNode}
      componentWidth={componentWidth}
      tupleNumber={tupleNumber}
      gap={gap}
    />
  ), [onAddNode, componentWidth, tupleNumber, gap]);

  return (
    <div className='overflow-y-auto' ref={containerRef}>
      <VisualScrollList
        ref={listRef}
        containerRef={containerRef}
        viewportHeight={viewportHeight}
        listItemHeight={60}
        list={components}
        tupleNumber={tupleNumber}
        gap={gap}
        render={render}
      />
    </div>
  );
};

export default SearchResultList;
