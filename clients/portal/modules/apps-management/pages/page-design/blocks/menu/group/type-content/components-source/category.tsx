import React, { CSSProperties } from 'react';
import cs from 'classnames';

import type { PackageComponent } from '@pageDesign/blocks/menu/type';

import ComponentRender from './component-render';
import Search from './search';

import styles from './index.m.scss';

interface Props {
  name: string;
  components: PackageComponent[];
  onAddNode: () => void;
  isIconPackage: boolean;
  isAllPackage: boolean;
  style?: CSSProperties;
  className?: string;
}

const Category = (props: Props): JSX.Element => {
  const { name, components, onAddNode, className, style, isIconPackage, isAllPackage } = props;
  const addonClassName = isIconPackage || isAllPackage ? 'h-full overflow-hidden' : '';

  return (
    <div className={cs(styles.cate, className, addonClassName)} style={style}>
      <div className={styles.title}>{name}</div>
      <Search
        show={isIconPackage}
        components={components}
        onAddNode={onAddNode}
        placeholder='搜索图标'
      />
      <Search
        show={isAllPackage}
        components={components}
        onAddNode={onAddNode}
        placeholder='搜索所有组件'
      />
      {!isIconPackage && !isAllPackage && (
        <div className={styles.elems}>
          {components?.map((component) => {
            return (
              <ComponentRender
                {...component}
                key={component.name}
                onAddNode={onAddNode}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Category;
