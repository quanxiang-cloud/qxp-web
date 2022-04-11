import React, { CSSProperties } from 'react';
import cs from 'classnames';
import { useDrag } from 'react-dnd';

import type { PackageComponent } from '@pageDesign/blocks/menu/type';
import { useCtx } from '@pageDesign/ctx';
import { useMenuContext } from '@pageDesign/blocks/menu/context';

import styles from './index.m.scss';

interface Props extends PackageComponent {
  onAddNode: () => void;
  style?: CSSProperties;
  className?: string;
}

const ComponentRender = (props: Props): JSX.Element => {
  const { onAddNode, name, Icon, desc, package: pkg, label, initialProps, style, className } = props;
  const { artery, onArteryChange } = useMenuContext() ?? {};
  const { page } = useCtx();

  function addNodeToCanvas(target?: any): void {
    const prepareNode = {
      exportName: name,
      label,
      defaultConfig: initialProps,
    };
    page.appendNode(prepareNode, target, { from: 'source' });
    onAddNode();
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'source_elem',
    item: { exportName: name, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const targetNode: any = monitor.getDropResult();
      targetNode?.exportName && addNodeToCanvas(targetNode);
    },
  }));

  return (
    <div
      className={cs(styles.sourceElem, className, { [styles.dragging]: isDragging })}
      ref={drag}
      onClick={() => addNodeToCanvas()}
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
