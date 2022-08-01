import React, { useContext, useState } from 'react';
import type { Node } from '@one-for-all/artery';

import type { Package } from '@pageDesign/blocks/fountainhead/type';
import Loading from '@c/loading';

import PackageSelector from './package-selector';
import CategoriesRender from './categories-render';
import FountainContext from '../../fountain-context';

import styles from './index.m.scss';

interface Props {
  onAddNode: (node: Node) => void;
}

function Fountainhead({ onAddNode }: Props): JSX.Element {
  const [currentPackage, setCurrentPackage] = useState<Package | undefined>();
  const { components } = useContext(FountainContext);

  const currentComponents = components?.filter(
    (component) => component.package.name === currentPackage?.name,
  );

  if (!currentComponents) {
    return <Loading desc="loading..." />;
  }

  return (
    <div className={styles.comps}>
      <PackageSelector current={currentPackage} onChange={setCurrentPackage} />
      <CategoriesRender
        onAddNode={onAddNode}
        components={currentComponents}
        categories={currentPackage?.categories}
        isIconPackage={currentPackage?.name === '@one-for-all/icon'}
      />
    </div>
  );
}

export default Fountainhead;
