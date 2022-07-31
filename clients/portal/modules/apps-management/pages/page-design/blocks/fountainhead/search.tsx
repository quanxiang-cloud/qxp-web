import React, { useState } from 'react';
import type { Node } from '@one-for-all/artery';

import { PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import { fuzzyFind } from '@c/visual-scroll-list';

import ComponentSearch from './component-search';

interface Props {
  show: boolean;
  components: PackageComponentWithDistance[];
  onAddNode: (node: Node) => void;
  placeholder: string;
}

interface PackageComponentWithDistance extends PackageComponent {
  distance?: number;
}

const Search = ({ show, components, onAddNode, placeholder }: Props): JSX.Element | null => {
  const [keyword, setKeyword] = useState<string>('');
  const pathesList = [['label'], ['desc'], ['category'], ['name']];
  const highLightPathesList = [['label']];
  const fuzzyFindParams = {
    list: components,
    search: keyword,
    pathesList,
    highLightPathesList,
    distancePathes: ['label'],
  };
  const componentsFilted = keyword ? fuzzyFind(fuzzyFindParams) : components;

  const viewportHeight = window.innerHeight - 200;
  const componentWidth = 60;
  const tupleNumber = 4;
  const gap = 4;

  if (!show) {
    return null;
  }

  function componentsSorter(cur: PackageComponentWithDistance, next: PackageComponentWithDistance): number {
    const diff = (cur.distance ?? Infinity) - (next.distance ?? Infinity);
    return isNaN(diff) ? 0 : diff;
  }

  return (
    <ComponentSearch
      placeholder={placeholder}
      value={keyword}
      onChange={setKeyword}
      viewportHeight={viewportHeight}
      tupleNumber={tupleNumber}
      gap={gap}
      componentWidth={componentWidth}
      components={componentsFilted.sort(componentsSorter)}
      onAddNode={onAddNode}
    />
  );
};

export default Search;
