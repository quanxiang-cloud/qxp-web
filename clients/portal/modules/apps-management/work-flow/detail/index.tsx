import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import Header from './flow-header';
import AsideMenu from './aside-menu';
import Content from './content';
import { getWorkFlowInfo } from './api';
import Loading from '@c/loading';
import Error from '@c/error';

import store from './content/editor/store';

import './style.scss';

export default function Detail() {
  const [currentOperateType, setCurrentOperateType] = useState<
    'edit' | 'settings' | 'variables'
  >('edit');

  const { id, type } = useParams() as { id: string; type: string; };

  const { data, isLoading, isError } = useQuery(['GET_WORK_FLOW_INFO', id], getWorkFlowInfo, {
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    store.next({
      ...store.value,
      elements: JSON.parse(data.bpmnText),
      name: data.name,
      cancelable: data.canCancel === '1',
      urgeable: data.canUrge === '1',
      seeStatusAndMsg: data.canViewStatusMsg === '1',
      nodeAdminMsg: data.canMsg === '1',
      status: data.status,
      triggerMode: type || data.triggerMode,
    });
  }, [data]);

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
