import React, { Fragment, DragEvent, useRef, useEffect, useState } from 'react';
import cs from 'classnames';
import { prop, cond, equals, always, T } from 'ramda';
import ReactFlow, { ReactFlowProps, OnLoadParams, useStoreState } from 'react-flow-renderer';
import { SmartEdge } from '@tisoap/react-flow-smart-edge';

import RenderConfig, { Props as Config } from './render-config';
import CurvedEdge from './edges/curved';
import useDagreLayout from './hooks/use-dagre-layout';
import useFitView from './hooks/use-fit-view';
import useElkLayout from './hooks/use-elk-layout';

export interface Props extends Omit<ReactFlowProps, 'onDragOver'> {
  config?: Config;
  siblings?: JSX.Element;
  layoutType: 'dagre' | 'elk';
  direction: 'right' | 'bottom';
}

export default function RenderLayout({
  elements = [], className, config, snapGrid = [16, 16], snapToGrid = true, siblings,
  nodeTypes, edgeTypes, onLoad: callerOnload, layoutType, direction, ...restProps
}: Props): JSX.Element {
  const nodes = useStoreState(prop('nodes'));
  const layoutedDagreElements = useDagreLayout(elements, direction);
  const layoutedElkElements = useElkLayout(elements, direction);
  const fitView = useFitView(config?.control?.fitViewParams);
  const callOnLoad = useRef<() => void>(() => undefined);
  const isHide = nodes.some((node) => !node.position.x || !node.position.y);
  const [initFitView, setInitFitView] = useState(false);

  const getLayoutedElements = cond([
    [equals('dagre'), always(layoutedDagreElements)],
    [equals('elk'), always(layoutedElkElements)],
    [T, always(elements)],
  ]);
  const layoutedElements = getLayoutedElements(layoutType);

  useEffect(onLoad, [nodes]);

  function onLoadDone(params: OnLoadParams): () => void {
    let runded = false;
    return () => {
      if (runded) {
        return;
      }
      runded = true;
      callerOnload?.(params);
    };
  }

  function onLoad(params?: OnLoadParams): void {
    if (params) {
      callOnLoad.current = onLoadDone(params);
    }
    if (!nodes.length) {
      return;
    }
    if (!initFitView) {
      fitView();
      setInitFitView(true);
    }
    callOnLoad.current();
  }

  function onDragOver(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    if (!e.dataTransfer) {
      return;
    }
    e.dataTransfer.dropEffect = 'move';
  }

  const hasCursorStyle = restProps.style?.cursor || className?.includes('cursor');
  const distClassName = hasCursorStyle ? className : cs(className, 'cursor-move', { 'opacity-0': isHide });

  return (
    <Fragment>
      <div className="reactflow-wrapper w-full h-full flex-1">
        <ReactFlow
          {...restProps}
          elements={layoutedElements}
          onLoad={onLoad}
          onDragOver={onDragOver}
          nodeTypes={{ ...nodeTypes }}
          edgeTypes={{ ...edgeTypes, smart: SmartEdge, curved: CurvedEdge }}
          className={distClassName}
          snapGrid={snapGrid}
          snapToGrid={snapToGrid}
          panOnScroll={true}
        >
          <RenderConfig {...config} />
        </ReactFlow>
      </div>
      {siblings}
    </Fragment>
  );
}
