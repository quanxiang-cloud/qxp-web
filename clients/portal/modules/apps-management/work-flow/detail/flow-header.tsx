import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import cs from 'classnames';
import { useMutation } from 'react-query';

import Icon from '@c/icon';
import Button from '@c/button';
import { last } from '@lib/utils';
import More from '@c/more';
import useObservable from '@lib/hooks/use-observable';
import toast from '@lib/toast';

import NavButton from '../../../../global-header/nav-button';
import ActionButtonGroup from './content/editor/components/_common/action-button-group';
import { toggleWorkFlow } from './api';
import store, {
  StoreValue,
  updateStore,
} from './content/editor/store';

export default function GlobalHeader() {
  const { pathname } = useLocation();
  const { name = '', status, id } = useObservable<StoreValue>(store) || {};
  const [workFlowName, setWorkFlowName] = useState(name);
  const [isWorkFlowNameMenuOpen, setIsWorkFlowNameMenuOpen] = useState(false);
  const paramsMap = {
    'form-data': '工作表触发',
    'form-time': '工作表时间触发',
  };
  const type = last(pathname.split('/')) as 'form-data' | 'form-time';
  const history = useHistory();
  const toggleMutation = useMutation(toggleWorkFlow, {
    onSuccess: () => {
      toast.success(status === 'ENABLE' ? '下架成功' : '发布成功');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });

  function onCancelSetWorkFlowName() {
    setWorkFlowName(name);
    setIsWorkFlowNameMenuOpen(false);
  }

  function onSubmitWorkFlowName() {
    updateStore('name', () => workFlowName);
    setIsWorkFlowNameMenuOpen(false);
  }

  function onPublishSubmit() {
    toggleMutation.mutate({
      id: id as string,
      status: 'ENABLE',
    });
  }

  function onUnPublishSubmit() {
    toggleMutation.mutate({
      id: id as string,
      status: 'DISABLE',
    });
  }

  return (
    <header className="flex justify-between items-center py-18 px-24 bg-white shadow-flow-header">
      <section className="flex flex-row items-center">
        <Icon
          name="arrow-go-back"
          size={22}
          className="mr-22 cursor-pointer"
          onClick={() => history.goBack()}
        />
        <span
          className="mr-8 text-caption-no-color text-amber-600 px-6 bg-amber-50
          rounded-tl-6 rounded-br-6"
        >
          {paramsMap[type]}
        </span>
        <div className="flex items-center">
          <span className="mr-8 text-h6 font-semibold">{name || '未命名工作流'}</span>
          <More<JSX.Element>
            open={isWorkFlowNameMenuOpen}
            contentItemClassName="hover:bg-white"
            contentClassName="w-316 -left-80 p-0"
            items={[(
              <div
                key="editWorkflow"
                className="flex flex-col p-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-body2 text-gray-600 mb-8">工作流名称</div>
                <input
                  className="input mb-4"
                  value={workFlowName}
                  onChange={(e) => setWorkFlowName(e.target.value)}
                />
                <span className="text-caption text-gray-600">不超过3个字</span>
                <ActionButtonGroup
                  onCancel={onCancelSetWorkFlowName}
                  onSubmit={onSubmitWorkFlowName}
                />
              </div>
            )]}
          >
            <Icon
              name="edit"
              size={16}
              className="cursor-pointer"
              onClick={() => setIsWorkFlowNameMenuOpen(true)}
            />
          </More>
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
          {status === 'DISABLE' && (
            <Button
              modifier="primary"
              forbidden={!id}
              iconName="toggle_on"
              className="py-5"
              onClick={onPublishSubmit}
            >
              发布
            </Button>
          )}
          {status === 'ENABLE' && (
            <Button
              forbidden={!id}
              iconName="toggle_on"
              className="py-5"
              onClick={onUnPublishSubmit}
            >
              下架
            </Button>
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
