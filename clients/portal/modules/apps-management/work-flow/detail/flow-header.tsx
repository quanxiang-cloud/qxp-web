import React, { useState, useEffect, MouseEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import cs from 'classnames';
import { useMutation } from 'react-query';
import { FlowElement } from 'react-flow-renderer';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';

import Icon from '@c/icon';
import Button from '@c/button';
import useObservable from '@lib/hooks/use-observable';
import toast from '@lib/toast';
import NavButton from '@portal/global-header/nav-button';

import ActionButtonGroup from './content/editor/components/_common/action-button-group';
import { toggleWorkFlow } from './api';
import type { StoreValue } from './content/editor/type';
import store, {
  updateStore,
  updateStoreByKey,
} from './content/editor/store';

export default function FlowHeader(): JSX.Element {
  const { name = '', status, id, triggerMode, saved } = useObservable<StoreValue>(store);
  const history = useHistory();
  const popperParams = {
    modifiers: [{ name: 'offset', options: { offset: [0, 6] } }],
    placement: 'bottom-start' as Placement,
  };
  const [flowNameElRef, setFlowNameElRef] = useState(null);
  const [flowNamePopperElRef, setFlowNamePopperElRef] = useState(null);
  const flowNamePopper = usePopper(flowNameElRef, flowNamePopperElRef, popperParams);
  const [flowActionElRef, setFlowActionElRef] = useState(null);
  const [flowActionPopperElRef, setFlowActionPopperElRef] = useState(null);
  const flowActionPopper = usePopper(flowActionElRef, flowActionPopperElRef, popperParams);

  const [workFlowName, setWorkFlowName] = useState(name);
  const [isWorkFlowNameMenuOpen, setIsWorkFlowNameMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { type } = useParams<{ type: 'form-data' | 'form-time'; }>();
  const paramsMap = {
    FORM_DATA: '工作表触发',
    FORM_TIME: '工作表时间触发',
    'form-data': '工作表触发',
    'form-time': '工作表时间触发',
  };
  const toggleMutation = useMutation(toggleWorkFlow, {
    onSuccess: () => {
      toast.success(status === 'ENABLE' ? '工作流下架成功' : '工作流发布成功');
      updateStore((s) => ({
        ...s,
        status: status === 'DISABLE' ? 'ENABLE' : 'DISABLE',
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

  useEffect(() => {
    if (name && !workFlowName) {
      setWorkFlowName(name);
    }
  }, [name]);

  function onCancelSetWorkFlowName(): void {
    setWorkFlowName(name);
    setIsWorkFlowNameMenuOpen(false);
  }

  function onSubmitWorkFlowName(): void {
    updateStoreByKey('name', () => workFlowName);
    setIsWorkFlowNameMenuOpen(false);
  }

  function onConfirmSubmit(e: MouseEvent): void {
    e.stopPropagation();
    setIsConfirmOpen(!!id);
  }

  function handleSubmit(): void {
    toggleMutation.mutate({
      id: id as string,
      status: status === 'DISABLE' ? 'ENABLE' : 'DISABLE',
    });
    setIsConfirmOpen(false);
  }

  function onConfirmTip(): void {
    if (!id) {
      toast.error('请先配置并保存工作流后再试');
    }
  }

  function renderActionButtons(): JSX.Element {
    return (
      <>
        {status === 'DISABLE' && (
          <div className={cs({ 'cursor-not-allowed': !id })} onClick={onConfirmTip}>
            <Button
              modifier="primary"
              forbidden={!id}
              iconName="toggle_on"
              className="py-5"
              onClick={onConfirmSubmit}
              ref={setFlowActionElRef as any}
            >
              发布
            </Button>
          </div>
        )}
        {status === 'ENABLE' && (
          <Button
            forbidden={!id}
            iconName="toggle_on"
            className="py-5"
            onClick={onConfirmSubmit}
            ref={setFlowActionElRef as any}
          >
            下架
          </Button>
        )}
      </>
    );
  }

  function onGoBack(e: MouseEvent): void {
    e.stopPropagation();
    history.goBack();
  }

  return (
    <header className="flex justify-between items-center py-18 px-24 bg-white shadow-flow-header">
      <section className="flex flex-row items-center">
        <div className="cursor-pointer flex items-center" onClick={onGoBack}>
          <Icon
            name="arrow-go-back"
            size={22}
            className="mr-4"
          />
          <span className="text-body2">返回</span>
        </div>
        <span className="ml-8 mr-10">/</span>
        <span
          className="mr-8 text-caption-no-color text-amber-600 px-6 bg-amber-50
          rounded-tl-6 rounded-br-6"
        >
          {paramsMap[type || triggerMode]}
        </span>
        <div className="flex items-center">
          <span className="mr-8 text-h6 font-semibold">{name}</span>
          <Icon
            name="edit"
            size={16}
            className="cursor-pointer"
            onClick={() => setIsWorkFlowNameMenuOpen(true)}
            ref={setFlowNameElRef as any}
          />
          {isWorkFlowNameMenuOpen && (
            <div
              {...flowNamePopper.attributes.popper}
              ref={setFlowNamePopperElRef as any}
              style={flowNamePopper.styles.popper}
              className="rounded-8 flex flex-col px-20 pt-20 w-316 border border-gray-300 z-50 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-body2 text-gray-600 mb-8">工作流名称</div>
              <input
                className="input mb-4"
                value={workFlowName}
                onChange={(e) => e.target.value.length <= 30 && setWorkFlowName(e.target.value)}
              />
              <span className="text-caption text-gray-600">不超过30个字符</span>
              <ActionButtonGroup
                onCancel={onCancelSetWorkFlowName}
                onSubmit={onSubmitWorkFlowName}
              />
            </div>
          )}
          {saved && (
            <span
              className={cs(
                'text-body2-no-color px-8 py-1 rounded-tl-6 rounded-br-6 mr-24 ml-18',
                'text-green-600 bg-green-50',
              )}>
              已保存
            </span>
          )}
        </div>
      </section>
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
          {!isConfirmOpen && renderActionButtons()}
          {isConfirmOpen && (
            <>
              {renderActionButtons()}
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
        </div>
        <NavButton
          className="mr-0"
          iconName="help"
        />
      </section>
    </header>
  );
}
