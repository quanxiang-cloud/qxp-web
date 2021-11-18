import React, { DragEvent, useState, MouseEvent } from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';
import cs from 'classnames';

import ToolTip from '@c/tooltip/tip';
import useObservable from '@lib/hooks/use-observable';

import store, { updateStoreByKey } from '../store';
import type { EdgeProps, FormDataData, StoreValue } from '../type';
import { getCenter, getFixedSourcePosition } from '../utils';
import EdgeText from './_components/edge-text';
import useEdgeSwitch from './hooks/use-edge-switch';

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
}: EdgeProps): JSX.Element {
  const { elements = [], status, readonly } = useObservable<StoreValue>(store);
  let fixedSourceX = sourceX;
  let fixedSourceY = sourceY;
  let fixedTargetX = targetX;
  let fixedTargetY = targetY;
  if (readonly) {
    const fixedSource = getFixedSourcePosition(source, sourcePosition);
    fixedSourceX = fixedSource.x;
    fixedSourceY = fixedSource.y;
    const fixedTarget = getFixedSourcePosition(target, targetPosition);
    fixedTargetX = fixedTarget.x;
    fixedTargetY = fixedTarget.y;
  }
  const [showTooltip, setShowTooltip] = useState(false);
  const edgePath = getSmoothStepPath({
    sourceX: fixedSourceX,
    sourceY: fixedSourceY,
    sourcePosition,
    targetX: fixedTargetX,
    targetY: fixedTargetY,
    targetPosition,
    borderRadius: 0,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [centerX, centerY] = getCenter({
    sourceX: fixedSourceX,
    sourceY: fixedSourceY,
    targetX: fixedTargetX,
    targetY: fixedTargetY,
    sourcePosition,
    targetPosition,
  });
  const switcher = useEdgeSwitch();
  const formDataElement = elements.find(({ type }) => type === 'formData');

  function onDragOver(e: DragEvent): void {
    e.preventDefault();
    updateStoreByKey('currentConnection', () => ({
      source,
      target,
      position: { x: centerX, y: centerY },
    }));
  }

  function onShowComponentSelector(e: MouseEvent<SVGElement>): void {
    e.stopPropagation();
    if (!hasForm) {
      return;
    }
    switcher(id, {
      source,
      target,
      position: { x: centerX, y: centerY },
    });
  }

  const hasForm = !!(formDataElement?.data?.businessData as FormDataData)?.form.name;
  const cursorClassName = cs({ 'cursor-not-allowed': !hasForm });

  return (
    <>
      <g
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cs(cursorClassName, { 'opacity-50': !hasForm })}
      >
        <path
          id={id}
          style={{ ...style, borderRadius: '50%' }}
          className={cs('react-flow__edge-path cursor-pointer pointer-events-none', cursorClassName)}
          d={edgePath}
          markerEnd={markerEnd}
          onDragOver={onDragOver}
        />
        {status === 'DISABLE' && (
          <EdgeText
            className={cursorClassName}
            style={{
              filter: 'drop-shadow(0px 8px 24px rgba(55, 95, 243, 1))',
              pointerEvents: 'all',
            }}
            rectClassName={cursorClassName}
            textClassName={cursorClassName}
            x={centerX}
            y={centerY}
            onDragOver={onDragOver}
            label={label}
            onClick={onShowComponentSelector}
            labelBgBorderRadius={14}
            width="28"
            height="28"
          />
        )}
      </g>
      {!hasForm && showTooltip && (
        <foreignObject x={centerX + 20} y={centerY - 18} width="220" height="36">
          <ToolTip
            label="请先为开始节点选择一张工作表"
            style={{
              transform: 'none',
              backgroundColor: 'transparent',
              alignItems: 'center',
            }}
            labelClassName="whitespace-nowrap text-12 bg-gray-700 rounded-8"
          />
        </foreignObject>
      )}
    </>
  );
}
