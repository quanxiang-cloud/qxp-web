import React, { CSSProperties, useState } from 'react';
import cs from 'classnames';

import type { PackageComponent } from '@pageDesign/blocks/menu/type';
import { useCtx } from '@pageDesign/ctx';
import { useMenuContext } from '@pageDesign/blocks/menu/context';

import styles from './index.m.scss';
import { Node } from '@one-for-all/artery';
import { generateNodeId } from '@portal/modules/apps-management/pages/page-design/utils';

interface Props extends PackageComponent {
  onAddNode: () => void;
  style?: CSSProperties;
  className?: string;
}

// todo refactor this
function genNode(props: Props): Node {
  return {
    id: generateNodeId('c'),
    type: 'react-component',
    packageName: 'ofa-ui',
    packageVersion: 'latest',
    exportName: 'container',
    label: props.label,
    // todo add default props
  };
}

const ComponentRender = (props: Props): JSX.Element => {
  const { onAddNode, name, Icon, desc, package: pkg, label, initialProps, style, className } = props;
  const { artery, onArteryChange } = useMenuContext() ?? {};
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
