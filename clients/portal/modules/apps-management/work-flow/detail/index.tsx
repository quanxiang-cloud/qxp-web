import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import Header from './flow-header';
import AsideMenu from './aside-menu';
import Content from './content';
import { getWorkFlowInfo } from './api';
import Loading from '@c/loading';
import Error from '@c/error';

import { updateStore, initStore } from './content/editor/store';

import './style.scss';

export default function Detail() {
  const [currentOperateType, setCurrentOperateType] = useState<
    'edit' | 'settings' | 'variables'
  >('edit');

  const { flowID, type } = useParams() as { flowID: string; type: string; };

  const { data, isLoading, isError } = useQuery(['GET_WORK_FLOW_INFO', flowID], getWorkFlowInfo, {
    enabled: !!flowID,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const bpmn = JSON.parse(data.bpmnText);
    updateStore(null, () => ({
      elements: bpmn.shapes,
      version: bpmn.version,
      name: data.name,
      cancelable: data.canCancel === 1,
      urgeable: data.canUrge === 1,
      seeStatusAndMsg: data.canViewStatusMsg === 1,
      nodeAdminMsg: data.canMsg === 1,
      status: data.status,
      triggerMode: type || data.triggerMode,
      id: data.id,
      processKey: data.processKey,
    }));
  }, [data]);

  useEffect(() => {
    !flowID && initStore();
  }, [flowID]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <Error desc="出错了..." />;
  }

  return (
    <>
      <Header />
      <section className="flex-1 flex">
        <AsideMenu onChange={setCurrentOperateType} currentOperateType={currentOperateType} />
        <Content currentOperateType={currentOperateType} />
      </section>
    </>
  );
}
