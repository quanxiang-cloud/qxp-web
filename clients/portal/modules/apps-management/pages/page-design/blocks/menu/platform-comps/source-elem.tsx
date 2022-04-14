import React from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';
import { toJS } from 'mobx';
import { Icon } from '@one-for-all/ui';

import { useCtx } from '../../../ctx';
import { SourceElement } from '../../../types';

import styles from './index.m.scss';

const iconsSizeGroup = {
  36: ['grid', 'container', 'text', 'para', 'image', 'button', 'link', 'iframe'],
  24: ['icon', 'radio', 'form', 'table', 'modal', 'input', 'textarea'],
};

function SourceElem(props: SourceElement<any>): JSX.Element {
  const { page, registry, designer } = useCtx();
  const compName = props.name.toLowerCase();

  function addNodeToCanvas(target?: any): void {
    const { defaultStyle, defaultConfig, category } = props;
    page.appendNode({
      exportName: compName,
      label: registry.getLabelByElemType(compName),
      defaultConfig: toJS(defaultConfig),
      defaultStyle: {
        // ...InitStyles,
        ...defaultStyle,
      },
      category,
    }, target, { from: 'source' });
    !designer.panelPinned && designer.setPanelOpen(false);
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'source_elem',
    item: { exportName: compName, label: props.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const targetNode: any = monitor.getDropResult();
      if (targetNode?.exportName) {
        window.__isDev__ && console.log(
          '[source-elem] dropped %o onto: %o, pos: %s',
          item,
          targetNode,
          page.dragPos,
        );
        addNodeToCanvas(targetNode);
      }
    },
  }));

  let iconSize = 48;
  if (iconsSizeGroup[36].includes(props.name)) {
    iconSize = 36;
  }
  if (iconsSizeGroup[24].includes(props.name)) {
    iconSize = 24;
  }

  return (
    <div
      className={cs(styles.sourceElem, { [styles.dragging]: isDragging })}
      ref={drag}
      onClick={() => addNodeToCanvas()}
    >
      <div
        className='w-full h-40 flex items-center justify-center bg-gray-50'
        style={{ filter: 'grayscale(100%)' }}
      >
        <Icon
          name={props.icon || 'insert_drive_file'}
          size={iconSize}
        />
      </div>
      <div>
        {props.label}
      </div>
    </div>
  );
}

export default SourceElem;
