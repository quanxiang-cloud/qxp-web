import React, { useCallback, HTMLAttributes } from 'react';
import cs from 'classnames';
import {
  useZoomPanHelper,
  useStoreState,
  useStoreActions,
} from 'react-flow-renderer';

import Icon from '@c/icon';

import ControlButton from './control-button';
import useFitView from '../hooks/use-fit-view';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
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
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
}: Props): JSX.Element {
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const { zoomIn, zoomOut } = useZoomPanHelper();
  const isInteractive = useStoreState(
    (s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable,
  );
  const zoomLevel = useStoreState((state) => state.transform[2]);
  const fitView = useFitView();

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

  const onInteractiveChangeHandler = useCallback(() => {
    setInteractive?.(!isInteractive);
    onInteractiveChange?.(!isInteractive);
  }, [isInteractive, setInteractive, onInteractiveChange]);

  return (
    <div className={cs('flex flex-row items-center justify-end', className)} style={style}>
      <div
        className="bg-white shadow-flow-header rounded-4 overflow-hidden flex flex-row items-center"
      >
        {showZoom && (
          <>
            <ControlButton onClick={onZoomOutHandler}>
              <Icon name="remove_circle_outline"/>
            </ControlButton>
            <div
              className="flex items-center bg-white cursor-text"
            >
              {`${Math.ceil(zoomLevel * 100)}%`}
            </div>
            <ControlButton onClick={onZoomInHandler}>
              <Icon name="add_circle_outline"/>
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

export default Controls;
