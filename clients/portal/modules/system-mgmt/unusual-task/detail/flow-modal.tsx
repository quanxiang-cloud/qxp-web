import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { FlowElement, isNode, ReactFlowProvider } from 'react-flow-renderer';

import Modal from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import dataTransfer from '@flowEditor/utils/data-transfer';
import FlowRender from '@c/flow-render';
import { getFlowInfo } from '../api';
import type { Data, WorkFlow } from '@portal/modules/apps-management/work-flow/detail/content/editor/type';

interface Props {
  flowInstanceId: string;
  closeModal(): void;
}

function FlowModal({ flowInstanceId, closeModal }: Props) {
  const [flowElements, setFlowElements] = useState<any>([]);
  const { data, isLoading, isError } = useQuery(['GET_WORK_FLOW_INFO', flowInstanceId], getFlowInfo, {
    enabled: !!flowInstanceId,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const bpmn = JSON.parse(data.bpmnText) as WorkFlow;
      setFlowElements(parseElements(bpmn));
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

  if (isError) {
    return <ErrorTips desc="出错了..." />;
  }

  if (flowElements.length === 0) { return null }

  return (
    <Modal
      title="流程图展示"
      onClose={closeModal}
      width={1000}
      height={600}
    >
      <div className="w-full h-full reactflow-wrapper" style={{ width: 920, height: 450 }}>
        <ReactFlowProvider>
          <FlowRender elements={flowElements} />
        </ReactFlowProvider>
      </div>
    </Modal>
  )
}

export default FlowModal;
