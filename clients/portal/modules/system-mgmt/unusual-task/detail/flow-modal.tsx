import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ReactFlowProvider } from 'react-flow-renderer';
import { cond, or, always } from 'ramda';

import Modal from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';
import useObservable from '@lib/hooks/use-observable';
import ErrorTips from '@c/error-tips';
import FlowRender from '@c/logic/flow-render';
import nodeTypes from '@flow/content/editor/nodes';
import edgeTypes from '@flow/content/editor/edges';
import type { WorkFlow, StoreValue } from '@flow/content/editor/type';
import { CURRENT_WORK_FLOW_VERSION } from '@flow/content/editor/utils/constants';
import store, {
  updateStore,
} from '@flow/content/editor/store';

import { getFlowInfo } from '../api';

// rollup can not resolve this path
// import '@flow/style.scss';
import '../../../work-flow/style.scss';
import { parseElements } from '@portal/utils';

interface Props {
  processInstanceId: string;
  closeModal(): void;
}

function FlowModal({ processInstanceId, closeModal }: Props): JSX.Element | null {
  const [flowParentElement, setFlowParentElement] = useState<HTMLDivElement | null>(null);
  const { elements } = useObservable<StoreValue>(store);
  const { data, isLoading, isError } = useQuery(['GET_WORK_FLOW_INFO', processInstanceId], getFlowInfo, {
    enabled: !!processInstanceId,
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

  const Error = cond([
    [() => isLoading, always(<Loading desc="加载中..." />)],
    [() => or(isError, !elements?.length), always(<ErrorTips desc="出错了..." />)],
  ]);

  return (
    <Modal
      title="流程图展示"
      onClose={closeModal}
      width={1000}
      height={600}
    >
      {isLoading ? <Error /> : (
        <ReactFlowProvider>
          <div className="w-full h-full reactflow-wrapper p-20" ref={setFlowParentElement}>
            {flowParentElement && (
              <FlowRender
                elements={elements}
                layoutType='elk'
                direction='bottom'
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
              />
            )}
          </div>
        </ReactFlowProvider>
      )}
    </Modal>
  );
}

export default FlowModal;
