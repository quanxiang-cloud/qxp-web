import React, { CSSProperties, useState, useMemo } from 'react';
import cs from 'classnames';
import type { Node, NodeProperties } from '@one-for-all/artery';
import { buildReactComponentNode } from '@one-for-all/artery-engine';

import type { PackageComponent } from '@pageDesign/blocks/fountainhead/type';
import { initialPropsToNodeProperties } from '@pageDesign/utils/package';

import { useFoutainheadContext } from './context';

import styles from './index.m.scss';

interface Props extends PackageComponent {
  onAddNode: (node: Node) => void;
  style?: CSSProperties;
  className?: string;
}

// todo refactor this
function genNode(props: Props): Node {
  const { package: pkg, name, label, initialProps } = props;
  let _initProps: NodeProperties = initialPropsToNodeProperties(initialProps);

  if (pkg.name === 'system-components' && name === 'NavigateMenu') {
    _initProps = Object.assign(_initProps, {
      goLink: {
        type: 'functional_property',
        func: {
          type: 'raw',
          args: 'path',
          body: `
            this.history.push(path);
          `,
        },
      },
    });
  }

  return buildReactComponentNode({
    packageName: pkg.name,
    packageVersion: pkg.version,
    exportName: name,
    label: label,
    props: _initProps,
  });
}

const ComponentRender = (props: Props): JSX.Element => {
  const { Icon, desc, package: pkg, label, style, className, onAddNode } = props;
  const [isDragging, setIsDragging] = useState(false);
  const { onPanelHide, onPanelClose } = useFoutainheadContext();
  const node = useMemo(() => genNode(props), [props]);

  function onDragEnd(): void {
    setIsDragging(false);
    onPanelClose?.();
  }

  return (
    <div
      draggable
      className={cs(styles.sourceElem, className, { [styles.dragging]: isDragging })}
      onClick={() => onAddNode(node)}
      onDragStart={(e) => {
        e.stopPropagation();

        setIsDragging(true);
        e.dataTransfer.setData('artery_node', JSON.stringify(node));
        onPanelHide?.();

        return false;
      }}
      onDragEnd={onDragEnd}
      title={`${pkg.name}:${desc}`}
      style={style}
    >
      <div
        className="w-full h-40 flex items-center justify-center bg-gray-50"
        style={{ filter: 'grayscale(100%)' }}
      >
        <Icon />
      </div>
      <div className="truncate w-full text-center" dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
};

export default ComponentRender;
