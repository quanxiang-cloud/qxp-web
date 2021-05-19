import React, { memo, useCallback, HTMLAttributes } from 'react';
import cs from 'classnames';
import { useMutation } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';
import {
  useZoomPanHelper,
  FitViewParams,
  useStoreState,
  useStoreActions,
} from 'react-flow-renderer';

import Icon from '@c/icon';
import Button from '@c/button';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/detail/content/editor/store';
import type { StoreValue } from '@flow/detail/content/editor/type';
import toast from '@lib/toast';

import ControlButton from './control-button';

import { saveWorkFlow, SaveWorkFlow } from '@flow/detail/api';

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
  const history = useHistory();
  const { appID } = useParams<{ type: string; appID: string; }>();
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();
  const {
    elements = [],
    id,
    name,
    triggerMode,
    version,
    cancelable: canCancel,
    urgeable: canUrge,
    seeStatusAndMsg: canViewStatusMsg,
    nodeAdminMsg: canMsg,
  } = useObservable<StoreValue>(store);
  const formDataElement = elements.find(({ type }) => type === 'formData');
  const form = formDataElement?.data?.businessData?.form;
  const approveOrFillInNode = elements.find(({ type }) => type === 'approve' || type === 'fillIn');
  const approveOrFillInNodes = elements.filter(({
    type,
  }) => type === 'approve' || type === 'fillIn');
  const approvePersons = approveOrFillInNodes?.map(({
    data,
  }) => data?.businessData?.basicConfig?.approvePersons);
  const hasApprovePersons = approvePersons?.every((
    approvePerson
  ) => approvePerson?.departments?.length || approvePerson?.users?.length);
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
      appID && respData?.id && history.push(`/apps/flow/${appID}/${respData?.id}`);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  function onSaveWorkFlow() {
    const saveData: SaveWorkFlow = {
      bpmnText: JSON.stringify({
        version,
        shapes: elements,
      }),
      name: name as string,
      triggerMode: triggerMode as string,
      canCancel: canCancel ? 1 : 0,
      canUrge: canUrge ? 1 : 0,
      canMsg: canMsg ? 1 : 0,
      canViewStatusMsg: canViewStatusMsg ? 1 : 0,
      appId: appID,
    };
    if (id) {
      saveData.id = id;
    }
    saveMutation.mutate(saveData);
  }

  function onSaveTip() {
    if (!name) {
      return toast.error('请配置工作流名称');
    }
    if (!form?.value) {
      return toast.error('请选择工作表');
    }
    if (!approveOrFillInNode) {
      return toast.error('请配置审批或填写节点');
    }
    if (!hasApprovePersons) {
      return toast.error('请为审批或填写节点配置审批人');
    }
  }

  const saveForbidden = !form?.name || !name || !triggerMode || !approveOrFillInNode ||
    !hasApprovePersons;

  return (
    <div className={cs('flex flex-row items-center justify-between', className)} style={style}>
      <div onClick={onSaveTip} className={cs({ 'cursor-not-allowed': saveForbidden })}>
        <Button
          modifier="primary"
          iconName="toggle_on"
          className="py-5"
          forbidden={saveForbidden}
          onClick={onSaveWorkFlow}
        >
        保存
        </Button>
      </div>
      <div
        className="bg-white shadow-flow-header rounded-4 overflow-hidden flex flex-row items-center"
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
