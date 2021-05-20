import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import toast from '@lib/toast';
import Modal from '@c/modal';
import useObservable from '@lib/hooks/use-observable';

import Header from './flow-header';
import AsideMenu from './aside-menu';
import Content from './content';
import { getWorkFlowInfo } from './api';
import type { StoreValue } from './content/editor/type';
import store, {
  updateStore,
  updateStoreByKey,
  initStore,
} from './content/editor/store';

import './style.scss';

export default function Detail() {
  const [currentOperateType, setCurrentOperateType] = useState<
    'edit' | 'settings' | 'variables'
  >('edit');
  const {
    showDataNotSaveConfirm, currentDataNotSaveConfirmCallback,
  } = useObservable<StoreValue>(store);

  const { flowID, type } = useParams<{ flowID: string; type: string; }>();

  const { data, isLoading, isError } = useQuery(['GET_WORK_FLOW_INFO', flowID], getWorkFlowInfo, {
    enabled: !!flowID,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const bpmn = JSON.parse(data.bpmnText);
      updateStore((s) => ({
        ...s,
        elements: bpmn.shapes.filter(Boolean),
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
    } catch (error) {
      toast.error('bpmn 数据格式解析错误!');
    }
  }, [data]);

  useEffect(() => {
    !flowID && initStore();
  }, [flowID]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <ErrorTips desc="出错了..." />;
  }

  function onConfirmCancel() {
    updateStoreByKey('showDataNotSaveConfirm', () => false);
  }

  function onConfirmSubmit() {
    onConfirmCancel();
    currentDataNotSaveConfirmCallback && currentDataNotSaveConfirmCallback();
  }

  return (
    <>
      <Header />
      {showDataNotSaveConfirm && (
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
          <p>您修改了工作流但未保存，离开后将丢失更改，确定要离开吗？</p>
        </Modal>
      )}
      <section className="flex-1 flex">
        <AsideMenu onChange={setCurrentOperateType} currentOperateType={currentOperateType} />
        <Content currentOperateType={currentOperateType} />
      </section>
    </>
  );
}
