import React, { CSSProperties, useState } from 'react';
import cs from 'classnames';
import type { Node } from '@one-for-all/artery';
import { buildReactComponentNode } from '@one-for-all/artery-engine';

import type { PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import { initialPropsToNodeProperties } from '@pageDesign/utils/package';
import { useFoutainheadContext } from './context';

import styles from './index.m.scss';

interface Props extends PackageComponent {
  onAddNode: () => void;
  style?: CSSProperties;
  className?: string;
}

// todo refactor this
function genNode(props: Props): Node {
  const { package: pkg, name, label, initialProps } = props;

  return buildReactComponentNode({
    packageName: pkg.name,
    packageVersion: pkg.version,
    exportName: name,
    label: label,
    props: initialPropsToNodeProperties(initialProps),
  });
}

const ComponentRender = (props: Props): JSX.Element => {
  const { Icon, desc, package: pkg, label, style, className } = props;
  const [isDragging, setIsDragging] = useState(false);
  const { onPanelHide, onPanelClose } = useFoutainheadContext();

  // function addNodeToCanvas(target?: any): void {
  //   const prepareNode = {
  //     exportName: name,
  //     label,
  //     defaultConfig: initialProps,
  //   };
  //   page.appendNode(prepareNode, target, { from: 'source' });
  //   onAddNode();
  // }

  function onDragEnd(): void {
    setIsDragging(false);
    onPanelClose?.();
  }

  return (
    <div
      draggable
      className={cs(styles.sourceElem, className, { [styles.dragging]: isDragging })}
      // onClick={() => addNodeToCanvas()}
      onDragStart={(e) => {
        e.stopPropagation();

        setIsDragging(true);
        e.dataTransfer.setData('artery_node', JSON.stringify(genNode(props)));
        onPanelHide?.();

        return false;
      }}
      onDragEnd={onDragEnd}
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
