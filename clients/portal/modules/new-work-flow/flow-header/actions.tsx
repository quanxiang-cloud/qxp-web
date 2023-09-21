/* eslint-disable no-empty */
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { FlowElement } from 'react-flow-renderer';
import { usePopper } from 'react-popper';
import cs from 'classnames';

import NavButton from '@portal/global-header/nav-button';
import useObservable from '@lib/hooks/use-observable';
import Icon from '@c/icon';
import toast from '@lib/toast';

import ActionButtonGroup from '../content/editor/components/_common/action-button-group';
import type { StoreValue } from '../content/editor/type';
import store, { updateStore, updateStoreByKey } from '../content/editor/store';
import { deletePipelineFlow, toggleWorkFlow, updateStatus } from '../api';
import { POPPER_PARAMS } from './constants';
import ActionButtons from './action-buttons';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@c/button';
import Modal from '@c/modal';

export default function FlowHeaderActions(): JSX.Element {
  const { status, id, elements, name } = useObservable<StoreValue>(store);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [flowActionElRef, setFlowActionElRef] = useState(null);
  const [flowActionPopperElRef, setFlowActionPopperElRef] = useState(null);
  const flowActionPopper = usePopper(flowActionElRef, flowActionPopperElRef, POPPER_PARAMS);
  const toggleMutation = useMutation(toggleWorkFlow, {
    onSuccess: () => {
      toast.success(status === 'ENABLE' ? '工作流下架成功' : '工作流发布成功');
      const _status = status === 'DISABLE' ? 'ENABLE' : 'DISABLE';
      try {
        window.PipelineFlowData.config.status = _status;
        updateStatus(window.PipelineFlowData);
      } catch (error) {
      }
      updateStore((s) => ({
        ...s,
        status: _status,
        errors: {
          ...s.errors,
          publish: {},
        },
      }));
    },
    onError: (e: ErrorWithData<{ data: FlowElement}>) => {
      if (e.data) {
        updateStoreByKey<Record<string, unknown>>('errors', (err) => ({
          ...err,
          publish: {
            data: e.data,
            msg: e.message,
          },
        }));
      }
      toast.error(e.message);
    },
  });

  const { flowID, appID, pID } = useParams<{ flowID: string; type: string; appID: string }>();
  const [pipelineStatus, setPipelineStatus] = useState('DISABLE');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const history = useHistory();

  function handleSubmit(): void {
    const tableID = elements?.find((item: any)=>item?.type === 'formData')?.data?.businessData?.form?.value;
    const triggerWay = elements?.find((item: any)=>item?.type === 'formData')?.data?.businessData?.triggerWay;
    const mapType: any = {
      whenAdd: 'CREATE',
      whenAlter: 'UPDATE',
    };
    triggerWay.forEach((item: any)=>{
      const type = mapType?.[item];
      if (status === 'DISABLE' ) { // 创建trigger
        toggleMutation.mutate({
          params: {
            name: `${id}_${type}`,
            pipelineName: id,
            data: {
              app_id: appID,
              table_id: tableID,
              type: type,
            },
          },
          status: 'ENABLE',
        });
      } else { // 删除trigger
        toggleMutation.mutate({
          name: `${id}_${type}`,
          status: 'DISABLE',
        });
      }
    });

    setIsConfirmOpen(false);
  }

  function handleOpen(): void {
    setIsConfirmOpen(true);
  }

  const handeleDelete = ()=>{
    if (status === 'ENABLE') {
      toast.error('已发布的流程不能删除，需要先下架后再删除');
      return;
    }
    setShowDeleteModal(true);
  };

  return (
    <section className="flex flex-row items-center">
      <div className="mr-32 pr-24 flex items-center border-r-1 border-gray-200">
        <span className="text-body2-no-color text-gray-400 mr-18">当前状态:</span>
        <span
          className={cs('text-body2-no-color px-8 py-1 rounded-tl-6 rounded-br-6 mr-24', {
            'text-gray-600': status === 'DISABLE',
            'bg-gray-100': status === 'DISABLE',
            'text-green-600': status === 'ENABLE',
            'bg-green-50': status === 'ENABLE',
          })}>
          {status === 'DISABLE' ? '草稿' : '已发布'}
        </span>
        {!isConfirmOpen && <ActionButtons ref={setFlowActionElRef as any} onOpen={handleOpen} />}
        {isConfirmOpen && (
          <>
            <ActionButtons ref={setFlowActionElRef as any} onOpen={handleOpen} />
            <div
              {...flowActionPopper.attributes.popper}
              ref={setFlowActionPopperElRef as any}
              style={flowActionPopper.styles.popper}
              className="rounded-8 flex flex-col px-20 pt-20 z-50 bg-white border border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="whitespace-nowrap flex flex-nowrap items-center text-body2 text-gray-600 mb-8"
              >
                <Icon size={20} name="info" className="text-yellow-600 mr-10" />
                <span className="text-h6-bold text-yellow-600 mr-152">
                    确定要{status === 'DISABLE' ? '发布' : '下架'}该工作流吗?
                </span>
              </div>
              <div className="text-body2 pl-24 mb-16">
                {status === 'DISABLE' && (
                  <>
                      发布后，新触发的数据将按该工作流进行流转。
                  </>
                )}
                {status === 'ENABLE' && (
                  <>
                      下架后，该工作流将会失效，且无法被触发；已触发的数据不受影响。
                  </>
                )}
              </div>
              <ActionButtonGroup
                onCancel={() => setIsConfirmOpen(false)}
                onSubmit={handleSubmit}
                className="p-0"
                okText={status === 'DISABLE' ? '确定发布' : '确定下架'}
              />
            </div>
          </>
        )}

        {status === 'DISABLE' &&
        <Button className='ml-20' modifier='primary' onClick={handeleDelete}>删除</Button>}
        {
          showDeleteModal &&
          (<Modal
            title="删除工作流"
            onClose={() => {
              setShowDeleteModal(false);
            }}
            footerBtns={[
              {
                text: '取消',
                key: 'cancel',
                onClick: () => {
                  setShowDeleteModal(false);
                },
              },
              {
                text: '确定',
                key: 'confirm',
                modifier: 'primary',
                onClick: () => {
                  deletePipelineFlow(flowID)
                    .then((res: any)=>{
                      toast.success(`工作流 ${name} 删除成功`);
                      history.goBack();
                    }).catch((err: any)=>{
                      toast.error(typeof err === 'string' ? err : err.message);
                    });
                  setShowDeleteModal(false);
                },
              },
            ]}
          >
            <p className="text-h5 p-20">
            确定要删除工作流
              <span className="font-bold mx-8">
                {name}
              </span>
            吗？删除后将无法恢复！
            </p>
          </Modal>)
        }
      </div>
      <NavButton
        className="mr-0"
        iconName="help"
      />
    </section>
  );
}
