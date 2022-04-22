import React, { useState } from 'react';

import type { Package } from '@pageDesign/blocks/menu/type';

import PackageSelector from './package-selector';
import CategoriesRender from './categories-render';
import { components } from './store';

import styles from './index.m.scss';

interface Props {
  onAddNode: () => void;
}

function ComponentSource({ onAddNode }: Props): JSX.Element {
  const [currentPackage, setCurrentPackage] = useState<Package | undefined>();
  const isAllPackage = currentPackage?.name === 'all';
  const currentComponents = components.filter(
    (component) => component.package.name === currentPackage?.name,
  );
  const distComponents = isAllPackage ? components : currentComponents;

  return (
    <div className={styles.comps}>
      <PackageSelector current={currentPackage} onChange={setCurrentPackage} />
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
