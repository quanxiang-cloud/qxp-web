import React, { useState } from 'react';

import { PackageComponent } from '@pageDesign/blocks/menu/type';
import { fuzzyFind } from '@c/visual-scroll-list';

import ComponentSearch from './component-search';

interface Props {
  show: boolean;
  components: PackageComponent[];
  onAddNode: () => void;
  placeholder: string;
}

const Search = ({ show, components, onAddNode, placeholder }: Props): JSX.Element | null => {
  const [keyword, setKeyword] = useState<string>('');
  const pathesList = [['label'], ['desc'], ['category'], ['name']];
  const highLightPathesList = [['label']];
  const fuzzyFindParams = { list: components, search: keyword, pathesList, highLightPathesList };
  const componentsFilted = keyword ? fuzzyFind(fuzzyFindParams) : components;

  const viewportHeight = window.innerHeight - 200;
  const componentWidth = 60;
  const tupleNumber = 4;
  const gap = 4;

  if (!show) {
    return null;
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
      components={componentsFilted}
      onAddNode={onAddNode}
    />
  );
};

export default Search;
