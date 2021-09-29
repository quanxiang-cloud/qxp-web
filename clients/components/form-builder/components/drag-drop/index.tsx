import React, { useContext, useRef, useState } from 'react';
import { useDrop, useDrag, DropTargetMonitor } from 'react-dnd';
import { useCss } from 'react-use';
import { observer } from 'mobx-react';

import { AddOrUpdateField } from '@c/form-builder/store';
import { getFieldId } from '@c/form-builder/utils/fields-operator';

import { StoreContext } from '../../context';
import { draggingStyle } from './utils';

type Props = {
  id: string;
  schema?: SchemaWithId;
  children?: React.ReactNode;
  pid?: string;
  tabIndex?: string;
  [key: string]: any;
}

function DragDrop(props: Props): JSX.Element {
  const {
    id: dropId = 'root',
    children = null,
    pid,
    tabIndex,
  } = props;

  const store = useContext(StoreContext);
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DragPosition>('up');

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'CanvasDragEle',
    item: {
      dropId,
      dragId: store.activeFieldId,
      index: 0,
      from: 'canvas',
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [store.activeFieldId, store.flattenFields, store.schema]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['sideEle', 'CanvasDragEle'],
    drop: (item: any, monitor: DropTargetMonitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const { sourceId, dragId, from } = item;
      if (dragId === dropId) return;

      const draggingId = sourceId || dragId;
      let index = store.flattenFields.findIndex((v) => getFieldId(v) === dropId);

      if (['down', 'right'].includes(position)) {
        index = index + 1;
      }
      if (dropId === 'root') {
        index = store.flattenFields.length || 0;
      }

      const changedField: AddOrUpdateField = {
        fieldId: draggingId,
        index: Math.max(0, index),
        parentFieldId: pid,
        tabIndex,
      };

      if (from === 'canvas') {
        store.update(changedField);
      } else {
        store.insert(changedField);
      }
    },

    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      const didHover = monitor.isOver({ shallow: true });

      if (didHover) {
        // Get the center height of the drop object
        const {
          top: hoverDOMTop,
          bottom: hoverDOMBottom,
          left: hoverDOMLeft,
          right: hoverDOMRight,
        }: any =
          boxRef.current && boxRef.current.getBoundingClientRect();
        const hoverMiddleY = (hoverDOMBottom - hoverDOMTop) / 2;
        const hoverMiddleX = (hoverDOMRight - hoverDOMLeft) / 2;

        // Get the distance between drag top and drop object top
        const { x: dragOffsetX, y: dragOffsetY }: any = monitor.getSourceClientOffset();
        const hoverClientY = dragOffsetY - hoverDOMTop;
        const hoverClientX = dragOffsetX - hoverDOMLeft;

        let pos: DragPosition = hoverClientY <= hoverMiddleY ? 'up' : 'down';
        if (pid) {
          const parentComp = store.flattenFieldsMap[pid];
          const parentCompName = parentComp?.componentName?.toLocaleLowerCase();
          if (parentCompName === 'layoutgrid') {
            pos = hoverClientX <= hoverMiddleX ? 'left' : 'right';
          }
        }

        setPosition(pos);
      }
    },
  }), [position, store.schema, store.flattenFields]);

  const hoverInducement = {
    isActive: canDrop && isOver,
    isDragging,
    position,
    dropId,
  };

  dragPreview(drop(boxRef));
  const hiddenChildrenDOM = useCss({
    '& *': { visibility: 'hidden' },
  });

  return (
    <div
      key={dropId}
      ref={boxRef}
      className={isDragging ? hiddenChildrenDOM : ''}
      style={draggingStyle(hoverInducement)}
    >
      <div ref={dropId === store.activeFieldId ? drag : null}>
        {children}
      </div>
    </div>
  );
}

export default observer(DragDrop);
