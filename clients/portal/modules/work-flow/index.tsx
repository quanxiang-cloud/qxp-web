import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider } from 'react-flow-renderer';

import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import toast from '@lib/toast';
import Modal from '@c/modal';
import useObservable from '@lib/hooks/use-observable';
import usePrevious from '@lib/hooks/use-previous';

import Header from './flow-header';
import AsideMenu from './aside-menu';
import Content from './content';
import { getWorkFlowInfo } from './api';
import type { StoreValue, WorkFlow } from './content/editor/type';
import FlowContext from './flow-context';
import useSaver from './content/editor/forms/hooks/use-save';
import { CURRENT_WORK_FLOW_VERSION } from './content/editor/utils/constants';
import store, {
  updateStore,
  updateStoreByKey,
  initStore,
  buildWorkFlowSaveData,
} from './content/editor/store';

import './style.scss';
import { parseElements } from '@portal/utils';

type OperateType = 'edit' | 'settings' | 'variables';

export default function Detail(): JSX.Element {
  const { flowID, type, appID } = useParams<{ flowID: string; type: string; appID: string }>();
  const [currentOperateType, setCurrentOperateType] = useState<OperateType>('edit');
  const isFirstLoad = useRef(true);
  const {
    showDataNotSaveConfirm, currentDataNotSaveConfirmCallback, status, needSaveFlow, elements, id,
    apiFetched,
  } = useObservable<StoreValue>(store);

  const isEmptyWorkFlow = !id;

  const saver = useSaver(appID, flowID);

  const { data, isLoading, isError, refetch } = useQuery(['GET_WORK_FLOW_INFO', flowID], getWorkFlowInfo, {
    enabled: !!flowID,
    cacheTime: 0,
  });

  useEffect(() => {
    needSaveFlow && saveWorkFlow();
  }, [needSaveFlow]);

  useEffect(() => {
    if (currentOperateType === 'settings') {
      refetch();
    }
  }, [currentOperateType]);

  const previousElementsLength = usePrevious(elements?.length);
  useEffect(() => {
    if (status === 'ENABLE') {
      return;
    }
    if (flowID && !apiFetched) {
      return;
    }
    if (apiFetched && isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (previousElementsLength !== elements?.length && !isEmptyWorkFlow) {
      saveWorkFlow();
    }
  }, [elements?.length, apiFetched]);

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const bpmn = JSON.parse(data.bpmnText) as WorkFlow;
      updateStore((s) => ({
        ...s,
        apiFetched: true,
        readonly: false,
        elements: parseElements(bpmn),
        version: CURRENT_WORK_FLOW_VERSION,
        name: data.name,
        cancelable: data.canCancel === 1,
        urgeable: data.canUrge === 1,
        seeStatusAndMsg: data.canViewStatusMsg === 1,
        nodeAdminMsg: data.canMsg === 1,
        status: data.status,
        triggerMode: type || data.triggerMode,
        id: data.id,
        processKey: data.processKey,
        keyFields: data.keyFields,
        canCancelType: data.canCancelType === 0 ? 1 : data.canCancelType,
        canCancelNodes: data.canCancelNodes,
        instanceName: data.instanceName,
        cron: data?.cron || '',
      }));
    } catch (error) {
      toast.error('bpmn 数据格式解析错误!');
    }
  }, [data]);

  useEffect(() => {
    !flowID && initStore(type);
  }, [flowID]);

  function saveWorkFlow(): void {
    saver(buildWorkFlowSaveData(appID), () => {
      updateStore((s) => ({ ...s, saved: true, needSaveFlow: false }));
    });
  }

  function onConfirmCancel(): void {
    updateStoreByKey('showDataNotSaveConfirm', () => false);
  }

  function onConfirmSubmit(): void {
    onConfirmCancel();
    currentDataNotSaveConfirmCallback && currentDataNotSaveConfirmCallback();
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <ErrorTips desc="出错了..." />;
  }

  return (
    <FlowContext.Provider value={{ appID, flowID }}>
      <div className="flex flex-col h-screen">
        <ReactFlowProvider>
          <Header />
          {showDataNotSaveConfirm && (status !== 'ENABLE') && (
            <Modal
              title="工作流未保存"
              onClose={onConfirmCancel}
              footerBtns={[
                {
                  text: '取消',
                  key: 'cancel',
                  onClick: onConfirmCancel,
                },
                {
                  text: '确定',
                  key: 'confirm',
                  modifier: 'primary',
                  onClick: onConfirmSubmit,
                },
              ]}
            >
              <p className="p-20">您修改了工作流但未保存，离开后将丢失更改，确定要离开吗？</p>
            </Modal>
          )}
          <section className="flex-1 flex">
            <AsideMenu onChange={setCurrentOperateType} currentOperateType={currentOperateType} />
            <Content currentOperateType={currentOperateType} />
          </section>
        </ReactFlowProvider>
      </div>
    </FlowContext.Provider>
  );
}
