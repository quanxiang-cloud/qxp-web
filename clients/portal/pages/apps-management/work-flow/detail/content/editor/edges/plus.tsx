import React, { DragEvent } from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';

import store from '../store';

import { EdgeProps } from '../type';
import { getCenter } from '../utils';
import EdgeText from './_components/edge-text';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  arrowHeadType,
  markerEndId,
  source,
  target,
}: EdgeProps) {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [centerX, centerY] = getCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    store.next({
      ...store.value,
      currentConnection: {
        source,
        target,
        position: { x: centerX, y: centerY },
      },
    });
  }

  return (
    <>
      <path
        id={id}
        style={{ ...style, borderRadius: '50%' }}
        className="react-flow__edge-path cursor-pointer"
        d={edgePath}
        markerEnd={markerEnd}
        onDragOver={onDragOver}
      />
      <EdgeText
        x={centerX}
        y={centerY}
        onDragOver={onDragOver}
        label={label}
        onClick={(e) => {
          store.next({
            ...store.value,
            asideDrawerType: 'components',
            currentConnection: {
              source,
              target,
              position: { x: centerX, y: centerY },
            },
          });
          e.stopPropagation();
        }}
        labelBgBorderRadius={14}
        width="28"
        height="28"
      />
    </>
  );
}
