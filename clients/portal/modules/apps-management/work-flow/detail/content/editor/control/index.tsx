import React, { memo, useCallback, HTMLAttributes } from 'react';
import cs from 'classnames';
import { useMutation } from 'react-query';
import {
  useZoomPanHelper,
  FitViewParams,
  useStoreState,
  useStoreActions,
} from 'react-flow-renderer';

import Icon from '@c/icon';
import Button from '@c/button';
import useObservable from '@lib/hooks/use-observable';
import store, { StoreValue, updateStore } from '@flow/detail/content/editor/store';
import toast from '@lib/toast';

import ControlButton from './control-button';

import { saveWorkFlow, SaveWorkFlow } from '../../../api';

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
  const { elements = [], id, name, triggerMode } = useObservable<StoreValue>(store) || {};
  const formDataElement = elements.find(({ type }) => type === 'formData');

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

  const saveMutation = useMutation(saveWorkFlow, {
    onSuccess: (respData) => {
      toast.success('保存成功');
      updateStore(null, () => ({
        creatorId: respData.creatorId,
        id: respData.id,
      }));
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSaveWorkFlow = useCallback(() => {
    const saveData: SaveWorkFlow = {
      bpmnText: JSON.stringify(elements),
      name: name as string,
      triggerMode: triggerMode as string,
    };
    if (id) {
      saveData.id = id;
    }
    saveMutation.mutate(saveData);
  }, [saveMutation]);

  return (
    <div className={cs('flex flex-row items-center justify-between', className)}>
      <Button
        modifier="primary"
        iconName="toggle_on"
        className="py-5"
        forbidden={!formDataElement?.data.businessData.form.name || !name || !triggerMode}
        onClick={onSaveWorkFlow}
      >
        保存
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
