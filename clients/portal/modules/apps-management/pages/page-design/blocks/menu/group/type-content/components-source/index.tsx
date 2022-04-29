import React from 'react';

import type { Package } from '@pageDesign/blocks/menu/type';
import Loading from '@c/loading';

import PackageSelector from './package-selector';
import CategoriesRender from './categories-render';
import { useComponents } from './store';

import styles from './index.m.scss';

interface Props {
  onAddNode: () => void;
  currentPackage?: Package;
  onChangePackage: (pkg: Package) => void;
}

function ComponentSource({ onAddNode, currentPackage, onChangePackage }: Props): JSX.Element {
  const isAllPackage = currentPackage?.name === 'all';
  const components = useComponents();
  const currentComponents = components?.filter(
    (component) => component.package.name === currentPackage?.name,
  );
  const distComponents = isAllPackage ? components : currentComponents;

  if (!distComponents) {
    return <Loading desc="loading..." />;
  }

  return (
    <div className={styles.comps}>
      <PackageSelector current={currentPackage} onChange={onChangePackage} />
      <CategoriesRender
        onAddNode={onAddNode}
        components={distComponents}
        categories={currentPackage?.categories}
        isIconPackage={currentPackage?.name === '@one-for-all/icon'}
        isAllPackage={isAllPackage}
      />
    </div>
  );
}

export default ComponentSource;
