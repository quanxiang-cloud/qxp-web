import React, { useCallback, useEffect, useMemo, Fragment } from 'react';
import { prop, path } from 'ramda';
import cs from 'classnames';
import {
  useZoomPanHelper,
  useStoreState,
  useStoreActions,
  ControlProps,
} from 'react-flow-renderer';

import Icon from '@c/icon';

import ControlButton from './render-control-button';
import useFitView from './hooks/use-fit-view';

export interface Props extends Omit<ControlProps, 'onInteractiveChange' | 'showInteractive'> {
  nodeDraggable?: boolean;
}

export default function Controls({
  showZoom = true, showFitView = true, nodeDraggable = false, onZoomIn, onZoomOut,
  onFitView, style, className, fitViewParams,
}: Props): JSX.Element {
  const zoomLevel: number | undefined = useStoreState(path(['transform', 2]));
  const setNodesDraggable = useStoreActions(prop('setNodesDraggable'));
  const fitView = useFitView(fitViewParams);
  const { zoomIn, zoomOut } = useZoomPanHelper();

  useEffect(() => {
    setNodesDraggable(nodeDraggable);
  }, [nodeDraggable]);

  const onZoomInHandler = useCallback(() => {
    zoomIn?.();
    onZoomIn?.();
  }, [zoomIn, onZoomIn]);

  const onZoomOutHandler = useCallback(() => {
    zoomOut?.();
    onZoomOut?.();
  }, [zoomOut, onZoomOut]);

  const onFitViewHandler = useCallback(() => {
    fitView?.();
    onFitView?.();
  }, [fitView, onFitView]);

  const zoom = useMemo(() => {
    if (!showZoom) {
      return null;
    }
    return (
      <Fragment>
        <ControlButton onClick={onZoomOutHandler}>
          <Icon name="remove_circle_outline"/>
        </ControlButton>
        <div
          className="flex items-center bg-white cursor-text"
        >
          {`${Math.ceil((zoomLevel ?? 0) * 100)}%`}
        </div>
        <ControlButton onClick={onZoomInHandler}>
          <Icon name="add_circle_outline"/>
        </ControlButton>
      </Fragment>
    );
  }, [zoomLevel, showZoom]);

  const fit = useMemo(() => {
    if (!showFitView) {
      return null;
    }
    return (
      <ControlButton onClick={onFitViewHandler}>
        <Icon name="my_location"/>
      </ControlButton>
    );
  }, [showFitView, onFitViewHandler]);

  const contentClassName = 'bg-white shadow-flow-header rounded-4 overflow-hidden flex flex-row items-center';
  const wrapperClassName = cs(
    'flex flex-row items-center justify-end left-16 top-16 right-16 flex absolute z-10', className,
  );

  return (
    <div className={wrapperClassName} style={style}>
      <div className={contentClassName}>
        {zoom}{fit}
      </div>
    </div>
  );
}

Controls.displayName = 'Controls';
