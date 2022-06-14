import React, { CSSProperties } from 'react';
import cs from 'classnames';
import type { Node } from '@one-for-all/artery';

import type { PackageComponent } from '@pageDesign/blocks/fountainhead/type';

import ComponentRender from './component-render';
import Search from './search';

import styles from './index.m.scss';

interface Props {
  name: string;
  components: PackageComponent[];
  onAddNode: (node: Node) => void;
  isIconPackage: boolean;
  style?: CSSProperties;
  className?: string;
}

const Category = (props: Props): JSX.Element | null => {
  const { name, components, onAddNode, className, style, isIconPackage } = props;
  const addonClassName = isIconPackage ? 'h-full overflow-hidden' : '';

  const hide = !isIconPackage && !components.length;

  if (hide) {
    return null;
  }

  return (
    <div className={cs(styles.cate, className, addonClassName)} style={style}>
      <div className={styles.title}>{name}</div>
      <Search show={isIconPackage} components={components} onAddNode={onAddNode} placeholder="搜索图标" />
      {!isIconPackage && (
        <div className={styles.elems}>
          {components?.map((component) => {
            return (
              <ComponentRender
                {...component}
                key={`${component.name}${component.desc}`}
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
