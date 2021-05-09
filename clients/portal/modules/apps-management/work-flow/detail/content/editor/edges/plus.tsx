import React, { DragEvent, useState } from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';
import cs from 'classnames';

import ToolTip from '@c/tooltip/tip';
import useObservable from '@lib/hooks/use-observable';

import store, { StoreValue, updateStore } from '../store';
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
  const [showTooltip, setShowTooltip] = useState(false);
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
  const { elements = [] } = useObservable<StoreValue>(store) || {};
  const formDataElement = elements.find(({ type }) => type === 'formData');

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    updateStore('currentConnection', () => ({
      source,
      target,
      position: { x: centerX, y: centerY },
    }));
  }

  const hasForm = !!formDataElement?.data.businessData.form.name;
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
          className={cs('react-flow__edge-path cursor-pointer', cursorClassName)}
          d={edgePath}
          markerEnd={markerEnd}
          onDragOver={onDragOver}
        />
        <EdgeText
          className={cursorClassName}
          style={{
            filter: 'drop-shadow(0px 8px 24px rgba(55, 95, 243, 1))',
          }}
          rectClassName={cursorClassName}
          textClassName={cursorClassName}
          x={centerX}
          y={centerY}
          onDragOver={onDragOver}
          label={label}
          onClick={(e) => {
            e.stopPropagation();
            if (!hasForm) {
              return;
            }
            updateStore(null, () => ({
              asideDrawerType: 'components',
              currentConnection: {
                source,
                target,
                position: { x: centerX, y: centerY },
              },
            }));
          }}
          labelBgBorderRadius={14}
          width="28"
          height="28"
        />
      </g>
      {!hasForm && showTooltip && (
        <foreignObject x={centerX + 20} y={centerY - 18} width="220" height="36">
          <ToolTip
            show
            position="right"
            label="请先为开始节点选择一张工作表"
            style={{
              transform: 'none',
              backgroundColor: 'transparent',
              alignItems: 'center',
            }}
            arrowStyle={{ position: 'static', marginTop: 0 }}
            labelClassName="whitespace-nowrap text-12 bg-gray-700 rounded-8"
          />
        </foreignObject>
      )}
    </>
  );
}
