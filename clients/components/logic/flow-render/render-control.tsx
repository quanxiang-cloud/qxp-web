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
import Tooltip from '@c/tooltip';

import ControlButton from './render-control-button';
import useFitView from './hooks/use-fit-view';

export interface Props extends Omit<ControlProps, 'onInteractiveChange' | 'showInteractive'> {
  nodeDraggable?: boolean;
}

export default function Controls({
  showZoom = true, showFitView = true, nodeDraggable = false, onZoomIn, onZoomOut,
  onFitView, style, className, fitViewParams,
}: Props): JSX.Element {
  const zoomLevel: number = useStoreState(path(['transform', 2])) ?? 0.5;
  const setNodesDraggable = useStoreActions(prop('setNodesDraggable'));
  const fitView = useFitView(fitViewParams);
  const { zoomTo } = useZoomPanHelper();

  useEffect(() => {
    setNodesDraggable(nodeDraggable);
  }, [nodeDraggable]);

  function onZoomInHandler(): void {
    zoomTo(+(zoomLevel + 0.1).toFixed(1));
    onZoomIn?.();
  }

  function onZoomOutHandler(): void {
    zoomTo(+(zoomLevel - 0.1).toFixed(1));
    onZoomOut?.();
  }

  const onFitViewHandler = useCallback(() => {
    fitView?.();
    onFitView?.();
  }, [fitView, onFitView]);

  const offset: [number, number] = [0, 15];

  const zoom = useMemo(() => {
    if (!showZoom) {
      return null;
    }
    const currentLevel = +((zoomLevel ?? 0) * 100).toFixed(0);
    return (
      <Fragment>
        {currentLevel <= 50 ? (
          <ControlButton style={{ cursor: 'not-allowed' }}>
            <Icon name="remove_circle_outline" className="opacity-50" />
          </ControlButton>
        ) : (
          <Tooltip position="bottom" label="缩小" theme="dark" offset={offset}>
            <div>
              <ControlButton onClick={onZoomOutHandler}>
                <Icon name="remove_circle_outline"/>
              </ControlButton>
            </div>
          </Tooltip>
        )}
        <div
          className="flex items-center bg-white cursor-text"
        >
          {`${currentLevel}%`}
        </div>
        {currentLevel >= 200 ? (
          <ControlButton style={{ cursor: 'not-allowed' }}>
            <Icon name="add_circle_outline" className="opacity-50"/>
          </ControlButton>
        ) : (
          <Tooltip position="bottom" label="放大" theme="dark" offset={offset}>
            <div>
              <ControlButton onClick={onZoomInHandler}>
                <Icon name="add_circle_outline"/>
              </ControlButton>
            </div>
          </Tooltip>
        )}
      </Fragment>
    );
  }, [zoomLevel, showZoom, onZoomInHandler, onZoomOutHandler]);

  const fit = useMemo(() => {
    if (!showFitView) {
      return null;
    }
    return (
      <Tooltip position="bottom" label="自适应视图" theme="dark" offset={offset}>
        <div>
          <ControlButton onClick={onFitViewHandler}>
            <Icon name="my_location"/>
          </ControlButton>
        </div>
      </Tooltip>
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
