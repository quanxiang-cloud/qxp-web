import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FlowElement, isNode, ReactFlowProvider } from 'react-flow-renderer';

import Modal from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';
import useObservable from '@lib/hooks/use-observable';
import ErrorTips from '@c/error-tips';
import dataTransfer from '@flowEditor/utils/data-transfer';
import FlowRender from '@c/flow-render';
import type { Data, WorkFlow, StoreValue } from '@flowEditor/type';
import { CURRENT_WORK_FLOW_VERSION } from '@flowEditor/utils/constants';
import store, {
  updateStore,
} from '@flowEditor/store';

import { getFlowInfo } from '../api';

import '@flow/style.scss';

interface Props {
  flowInstanceId: string;
  closeModal(): void;
}

function FlowModal({ flowInstanceId, closeModal }: Props): JSX.Element | null {
  const [flowParentElement, setFlowParentElement] = useState<HTMLDivElement | null>(null);
  const { elements } = useObservable<StoreValue>(store);
  const { data, isLoading, isError } = useQuery(['GET_WORK_FLOW_INFO', flowInstanceId], getFlowInfo, {
    enabled: !!flowInstanceId,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const bpmn = JSON.parse(data.bpmnText) as WorkFlow;
      updateStore((s) => ({
        ...s,
        apiFetched: true,
        readonly: true,
        elements: parseElements(bpmn),
        version: CURRENT_WORK_FLOW_VERSION,
        name: data.name,
        cancelable: data.canCancel === 1,
        urgeable: data.canUrge === 1,
        seeStatusAndMsg: data.canViewStatusMsg === 1,
        nodeAdminMsg: data.canMsg === 1,
        status: data.status,
        triggerMode: data.triggerMode,
        id: data.id,
        processKey: data.processKey,
        keyFields: data.keyFields,
        canCancelType: data.canCancelType,
        canCancelNodes: data.canCancelNodes,
        instanceName: data.instanceName,
      }));
    } catch (error) {
      toast.error('bpmn 数据格式解析错误!');
    }
  }, [data]);

  function parseElements(bpmn: WorkFlow): FlowElement<Data>[] {
    const elements = bpmn.shapes.filter(Boolean).map((element: FlowElement<Data>) => {
      if (isNode(element)) {
        Object.assign(element.data, { type: element.type });
      }
      return element;
    });
    return dataTransfer({ version: bpmn.version, shapes: elements }).shapes;
  }

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError || !elements?.length) {
    return <ErrorTips desc="出错了..." />;
  }

  return (
    <Modal
      title="流程图展示"
      onClose={closeModal}
      width={1000}
      height={600}
    >
      <ReactFlowProvider>
        <div className="w-full h-full reactflow-wrapper p-20" ref={setFlowParentElement}>
          {flowParentElement && (
            <FlowRender elements={elements} />
          )}
        </div>
      </ReactFlowProvider>
    </Modal>
  );
}

export default FlowModal;
