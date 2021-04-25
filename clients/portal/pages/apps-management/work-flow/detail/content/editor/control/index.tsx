import React, { memo, useCallback, HTMLAttributes } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Button from '@c/button';

import ControlButton from './control-button';

import {
  useZoomPanHelper,
  FitViewParams,
  useStoreState,
  useStoreActions,
} from 'react-flow-renderer';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewParams?: FitViewParams;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

function Controls({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewParams,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
}: Props) {
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();

  const isInteractive = useStoreState(
    (s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable
  );
  const zoomLevel = useStoreState((state) => state.transform[2]);

  const onZoomInHandler = useCallback(() => {
    zoomIn?.();
    onZoomIn?.();
  }, [zoomIn, onZoomIn]);

  const onZoomOutHandler = useCallback(() => {
    zoomOut?.();
    onZoomOut?.();
  }, [zoomOut, onZoomOut]);

  const onFitViewHandler = useCallback(() => {
    fitView?.(fitViewParams);
    onFitView?.();
  }, [fitView, fitViewParams, onFitView]);

  const onInteractiveChangeHandler = useCallback(() => {
    setInteractive?.(!isInteractive);
    onInteractiveChange?.(!isInteractive);
  }, [isInteractive, setInteractive, onInteractiveChange]);

  return (
    <div className={cs('flex flex-row items-center justify-between', className)}>
      <Button
        modifier="primary"
        iconName="toggle_on"
        className="py-5"
      >
        发布
      </Button>
      <div
        className="bg-white shadow-flow-header rounded-4 overflow-hidden flex flex-row items-center"
        style={style}
      >
        {showZoom && (
          <>
            <ControlButton onClick={onZoomInHandler}>
              <Icon name="add_circle_outline"/>
            </ControlButton>
            <div
              className="flex items-center bg-white cursor-text"
            >
              {`${Math.ceil(zoomLevel * 100)}%`}
            </div>
            <ControlButton onClick={onZoomOutHandler}>
              <Icon name="remove_circle_outline"/>
            </ControlButton>
          </>
        )}
        {showFitView && (
          <ControlButton onClick={onFitViewHandler}>
            <Icon name="my_location"/>
          </ControlButton>
        )}
        {showInteractive && (
          <ControlButton onClick={onInteractiveChangeHandler}>
            {isInteractive ? <Icon name="lock_open" /> : <Icon name="lock" />}
          </ControlButton>
        )}
        {children}
      </div>
    </div>
  );
}

Controls.displayName = 'Controls';

export default memo(Controls);
