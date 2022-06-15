import React, { useMemo } from 'react';
import { forEach, groupBy, keys, pipe } from 'ramda';
import type { Node } from '@one-for-all/artery';

import type { PackageComponent } from '@pageDesign/blocks/fountainhead/type';

import Category from './category';

interface Props {
  onAddNode: (node: Node) => void;
  components: PackageComponent[];
  categories?: string[];
  isIconPackage: boolean;
}

const CategoriesRender = (props: Props): JSX.Element => {
  const { onAddNode, components, categories = [], isIconPackage } = props;
  let groupedComponents: Record<string, PackageComponent[] | undefined> = useMemo(() => {
    return groupBy((component: PackageComponent) => component?.category ?? '', components);
  }, [components]);

  pipe(
    keys,
    forEach((key) => !categories.includes(key) && categories.push(key)),
  )(groupedComponents);

  if (isIconPackage) {
    categories.splice(0);
    categories.push('');
    groupedComponents = { '': components };
  }

  return (
    <div className={isIconPackage ? 'overflow-hidden' : 'overflow-y-auto'}>
      {categories.map((category) => (
        <Category
          isIconPackage={isIconPackage}
          key={category}
          name={category}
          components={groupedComponents[category] ?? []}
          onAddNode={onAddNode}
        />
      ))}
    </div>
  );
};

export default CategoriesRender;
