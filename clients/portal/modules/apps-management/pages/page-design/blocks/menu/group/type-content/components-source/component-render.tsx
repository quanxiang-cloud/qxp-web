import React, { CSSProperties, useState } from 'react';
import cs from 'classnames';

import type { PackageComponent } from '@pageDesign/blocks/menu/type';
import { useCtx } from '@pageDesign/ctx';
import { buildReactComponentNode } from '@one-for-all/artery-engine';

import styles from './index.m.scss';
import { Node } from '@one-for-all/artery';

interface Props extends PackageComponent {
  onAddNode: () => void;
  style?: CSSProperties;
  className?: string;
}

// todo refactor this
function genNode(props: Props): Node {
  return buildReactComponentNode({
    packageName: props.package.name,
    packageVersion: props.package.version,
    exportName: props.name,
    label: props.label,
    // todo add default props
  });
}

const ComponentRender = (props: Props): JSX.Element => {
  const { onAddNode, name, Icon, desc, package: pkg, label, initialProps, style, className } = props;
  const { page } = useCtx();
  const [isDragging, setIsDragging] = useState(false);

  // function addNodeToCanvas(target?: any): void {
  //   const prepareNode = {
  //     exportName: name,
  //     label,
  //     defaultConfig: initialProps,
  //   };
  //   page.appendNode(prepareNode, target, { from: 'source' });
  //   onAddNode();
  // }

  return (
    <div
      draggable
      className={cs(styles.sourceElem, className, { [styles.dragging]: isDragging })}
      // onClick={() => addNodeToCanvas()}
      onDragStart={(e) => {
        e.stopPropagation();

        setIsDragging(true);
        e.dataTransfer.setData('__artery-node', JSON.stringify(genNode(props)));

        return false;
      }}
      onDragEnd={() => setIsDragging(false)}
      title={`${pkg.name}:${desc}`}
      style={style}
    >
      <div
        className='w-full h-40 flex items-center justify-center bg-gray-50'
        style={{ filter: 'grayscale(100%)' }}
      >
        <Icon />
      </div>
      <div className="truncate w-full text-center" dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
};

export default ComponentRender;
