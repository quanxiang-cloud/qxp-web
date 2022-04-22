import React, { useMemo } from 'react';
import { forEach, groupBy, keys, pipe } from 'ramda';

import type { PackageComponent } from '@pageDesign/blocks/menu/type';

import Category from './category';

interface Props {
  onAddNode: () => void;
  components: PackageComponent[];
  categories?: string[];
  isIconPackage: boolean;
  isAllPackage: boolean;
}

const CategoriesRender = (props: Props): JSX.Element => {
  const { onAddNode, components, categories = [], isIconPackage, isAllPackage } = props;
  let groupedComponents = useMemo(() => {
    return groupBy((component: PackageComponent) => component?.category ?? '', components);
  }, [components]);

  pipe(keys, forEach((key) => !categories.includes(key) && categories.push(key)))(groupedComponents);

  if (isAllPackage) {
    categories.splice(0);
    categories.push('');
    groupedComponents = { '': components };
  }

  return (
    <div className={isIconPackage || isAllPackage ? 'overflow-hidden' : 'overflow-y-auto'}>
      {categories.map((category) => (
        <Category
          isIconPackage={isIconPackage}
          isAllPackage={isAllPackage}
          key={category}
          name={category}
          components={groupedComponents[category]}
          onAddNode={onAddNode}
        />
      ))}
    </div>
  );
};

export default CategoriesRender;
