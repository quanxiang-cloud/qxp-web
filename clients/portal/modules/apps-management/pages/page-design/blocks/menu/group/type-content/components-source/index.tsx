import React from 'react';

import type { Package } from '@pageDesign/blocks/menu/type';

import PackageSelector from './package-selector';
import CategoriesRender from './categories-render';
import { components } from './store';

import styles from './index.m.scss';

interface Props {
  onAddNode: () => void;
  currentPackage?: Package;
  onChangePackage: (pkg: Package) => void;
}

function ComponentSource({ onAddNode, currentPackage, onChangePackage }: Props): JSX.Element {
  const isAllPackage = currentPackage?.name === 'all';
  const currentComponents = components.filter(
    (component) => component.package.name === currentPackage?.name,
  );
  const distComponents = isAllPackage ? components : currentComponents;

  return (
    <div className={styles.comps}>
      <PackageSelector current={currentPackage} onChange={onChangePackage} />
      <CategoriesRender
        onAddNode={onAddNode}
        components={distComponents}
        categories={currentPackage?.categories}
        isIconPackage={currentPackage?.name === 'icon'}
        isAllPackage={isAllPackage}
      />
    </div>
  );
}

export default ComponentSource;
