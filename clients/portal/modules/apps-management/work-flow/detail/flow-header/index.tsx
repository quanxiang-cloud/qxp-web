import React, { useState, useEffect, MouseEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import cs from 'classnames';
import { usePopper } from 'react-popper';

import Icon from '@c/icon';
import useObservable from '@lib/hooks/use-observable';

import ActionButtonGroup from '../content/editor/components/_common/action-button-group';
import Actions from './actions';
import type { StoreValue } from '../content/editor/type';
import store, { updateStore } from '../content/editor/store';
import { PARAMS_MAP, POPPER_PARAMS } from './constants';

export default function FlowHeader(): JSX.Element {
  const { name = '', triggerMode, saved } = useObservable<StoreValue>(store);
  const history = useHistory();
  const [flowNameElRef, setFlowNameElRef] = useState(null);
  const [flowNamePopperElRef, setFlowNamePopperElRef] = useState(null);
  const flowNamePopper = usePopper(flowNameElRef, flowNamePopperElRef, POPPER_PARAMS);

  const [workFlowName, setWorkFlowName] = useState(name);
  const [isWorkFlowNameMenuOpen, setIsWorkFlowNameMenuOpen] = useState(false);
  const { type } = useParams<{ type: 'form-data' | 'form-time'; }>();

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
    updateStore((s) => ({ ...s, name: workFlowName, needSaveFlow: true }));
    setIsWorkFlowNameMenuOpen(false);
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
          {PARAMS_MAP[type || triggerMode]}
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
      <Actions />
    </header>
  );
}
