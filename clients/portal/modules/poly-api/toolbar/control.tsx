import React, { useCallback, HTMLAttributes } from 'react';
import cs from 'classnames';
import {
  useZoomPanHelper,
  useStoreState,
} from 'react-flow-renderer';

import Icon from '@c/icon';

import ControlButton from './control-button';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

function Controls({
  style,
  showZoom = true,
  showFitView = true,
  onZoomIn,
  onZoomOut,
  onFitView,
  className,
  children,
}: Props): JSX.Element {
  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();
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
    fitView?.();
    onFitView?.();
  }, [fitView, onFitView]);

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
        {children}
      </div>
    </div>
  );
}

Controls.displayName = 'Controls';

export default Controls;
