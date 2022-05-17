import React, { useRef, useState, useEffect } from 'react';
import cs from 'classnames';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import Icon from '@one-for-all/icon';
import { ReactComp } from '@pageDesign/types';
import type { Node } from '@one-for-all/artery';

import { DRAG_TYPE } from './constants';
import { useOutLineContext } from './context';

interface Props {
  id: string;
  nodeName: string;
  hasChildren: boolean;
  expand: boolean;
  node?: Node;
  ComponentIcon?: ReactComp;
  onChangeExpand?: (expand: boolean) => void;
  onModifiedNodeName?: (nodeName: string) => void;
}

type LocationType = 'before' | 'after';

type DragItemType = {
  id: string;
};

export default function OutlineItemHeader({
  id,
  nodeName,
  hasChildren,
  ComponentIcon,
  expand,
  node,
  onChangeExpand,
  onModifiedNodeName,
}: Props): JSX.Element {
  const [hoverLocation, setHoverLocation] = useState<LocationType>();
  const [_nodeName, setNodeName] = useState(nodeName);
  const dragAndDrop = useRef<HTMLDivElement>(null);
  const { moveToById, rootNodeId, activeNodeId, setActiveNode } = useOutLineContext() || {};

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }, [id]);

  const [{ isHover }, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (item, monitor) => {
      const dragItemId = (item as DragItemType).id;
      if (dragItemId === id) return;

      setHoverLocation(computedLocation(monitor));
    },
    drop: (item, monitor) => {
      const dragItemId = (item as DragItemType).id;
      if (dragItemId === id) return;

      const location = computedLocation(monitor);

      if (location === 'after' && expand) {
        moveToById?.(dragItemId, id, 'inner');
      } else {
        moveToById?.(dragItemId, id, location);
      }

      setHoverLocation(undefined);
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  }, [id, moveToById]);

  useEffect(() => setNodeName(nodeName), [nodeName]);

  function computedLocation(monitor: DropTargetMonitor): LocationType {
    const { bottom, top } = dragAndDrop.current?.getBoundingClientRect() || { bottom: 0, top: 0 };
    const monitorTop = monitor.getClientOffset()?.y || 0;

    return (bottom - top) / 2 > monitorTop - top ? 'before' : 'after';
  }

  function handleChangeExpand(e: React.MouseEvent): void {
    e.stopPropagation();
    onChangeExpand?.(!expand);
  }

  function isRootNode(): boolean {
    return id === rootNodeId;
  }

  function handleChangeNodeName(): void {
    onModifiedNodeName?.(_nodeName);
  }

  function onKeyDown(e: React.KeyboardEvent): void {
    if (e.key !== 'Enter') return;
    handleChangeNodeName();
  }

  !isRootNode() && drag(dragAndDrop);
  drop(dragAndDrop);

  return (
    <div
      ref={dragAndDrop}
      className={cs(
        'flex w-full relative h-36 max-h-36 bg-white hover:bg-blue-100 py-5 rounded-6',
        isDragging && 'opacity-20',
        activeNodeId === id && 'bg-blue-100 text-blue-600',
      )}
      onClick={() => setActiveNode?.(node)}
    >
      <div
        className={cs(
          'w-full h-1/2 absolute top-0',
          isHover && 'bg-blue-100',
          hoverLocation === 'after' && 'top-1/2 rounded-b-6',
          hoverLocation === 'before' && 'rounded-t-6',
        )}
      />
      <div className="w-full h-full flex items-center z-10">
        {hasChildren && (<span onClick={handleChangeExpand}>
          <Icon
            style={{ transition: 'transform .2s linear' }}
            className={cs('cursor-pointer hover:text-black-900 transform', expand && 'rotate-90')}
            name="arrow_right"
            size={24}
          />
        </span>)}
        {ComponentIcon && (
          <div className='h-full w-24 overflow-hidden flex items-center justify-center'>
            <ComponentIcon />
          </div>
        )}
        <div className="px-1">
          <input
            type="text"
            className="outline-node-header-input w-full p-4 border-0"
            value={_nodeName}
            onBlur={handleChangeNodeName}
            onChange={(e) => setNodeName(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
