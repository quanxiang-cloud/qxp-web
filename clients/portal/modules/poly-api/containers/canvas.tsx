import React, { memo } from 'react';
import cs from 'classnames';
import ReactFlow, { OnLoadFunc } from 'react-flow-renderer';
import { useRendersCount } from 'react-use';
import { equals } from 'ramda';
import { SmartEdge } from '@tisoap/react-flow-smart-edge';

import useCloseNodeAction from '../effects/hooks/use-close-node-action';
import { POLY_DESIGN_CONFIG } from '../constants';
import useCanvasClick from '../effects/hooks/use-canvas-click';
import Toolbar from '../toolbar';

interface Props {
  hidden: boolean;
  elements: POLY_API.Element[];
  onLoad: OnLoadFunc;
}

function Canvas({
  hidden,
  elements,
  onLoad,
}: Props): JSX.Element {
  const handleCanvasClick = useCanvasClick();
  const renderCount = useRendersCount();

  useCloseNodeAction();

  console.log('render 次数', renderCount, elements);

  return (
    <ReactFlow
      className={cs('cursor-move', { 'opacity-0': hidden })}
      style={{ backgroundColor: POLY_DESIGN_CONFIG.BACKGROUND_COLOR }}
      elements={elements}
      nodeTypes={POLY_DESIGN_CONFIG.NODE_TYPES}
      edgeTypes={{ smart: SmartEdge }}
      nodesConnectable={false}
      nodesDraggable={false}
      arrowHeadColor={POLY_DESIGN_CONFIG.EDGE_COLOR}
      onPaneClick={handleCanvasClick}
      onPaneContextMenu={handleCanvasClick}
      onLoad={onLoad}
    >
      <Toolbar />
    </ReactFlow>
  );
}

export default memo(Canvas, (prevProps: Props, nextProps: Props): boolean => {
  const isHidden = prevProps.hidden === nextProps.hidden;
  const isOnloadNotChaned = prevProps.onLoad === nextProps.onLoad;
  const isElementsEqual = equals(prevProps.elements, nextProps.elements);
  return isElementsEqual && isHidden && isOnloadNotChaned;
});
