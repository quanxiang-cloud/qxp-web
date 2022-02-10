import React from 'react';
import { getMarkerEnd, useStoreState, Position, EdgeProps } from 'react-flow-renderer';
import cs from 'classnames';
import { getBoxToBoxArrow } from 'curved-arrows';
import { isNaN } from 'lodash';

export default function CustomEdge({
  id,
  sourcePosition,
  style = {},
  label,
  arrowHeadType,
  markerEndId,
  source,
  target,
}: EdgeProps): JSX.Element {
  const { nodes } = useStoreState((store) => store);
  const startNode = nodes.find((node) => node.id === source);
  const endNode = nodes.find((node) => node.id === target);

  let sourceX = startNode?.position.x ?? 0;
  let sourceY = startNode?.position.y ?? 0;
  const isBottom = sourcePosition === Position.Bottom;
  let widthOffset = startNode?.__rf.width / 2;
  widthOffset = isNaN(widthOffset) ? 0 : widthOffset;
  let heightOffset = startNode?.__rf.height / 2;
  heightOffset = isNaN(heightOffset) ? 0 : heightOffset;
  sourceX = isBottom ? (sourceX - widthOffset) : sourceX;
  sourceY = isBottom ? (sourceY + heightOffset) : sourceY;
  const targetX = endNode?.position.x ?? 0;
  const targetY = endNode?.position.y ?? 0;

  const sourceWidth = startNode?.__rf.width ?? 200;
  const sourceHeight = startNode?.__rf.height ?? 200;
  const targetWidth = endNode?.__rf.width ?? 200;
  const targetHeight = endNode?.__rf.height ?? 200;

  const [sx, sy, c1x, c1y, c2x, c2y, ex, ey] = getBoxToBoxArrow(
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    targetX,
    targetY,
    targetWidth,
    targetHeight,
  );
  const d = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const cursorClassName = '';

  return (
    <g className={cs(cursorClassName)}>
      <path
        id={id}
        style={{ ...style, borderRadius: '50%' }}
        className={cs('react-flow__edge-path cursor-pointer', cursorClassName)}
        d={d}
        markerEnd={markerEnd}
      />
      {label && (
        <text>
          <textPath xlinkHref={`#${id}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      )}
    </g>
  );
}

