import React, { useEffect, useRef } from 'react';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import useObservable from '@lib/hooks/use-observable';
import toast from '@lib/toast';

import store, { updateStoreByKey, updateStore } from '../editor/store';
import useSave from '../editor/forms/hooks/use-save';

import type { StoreValue } from '../editor/type';
import FlowContext from '../../flow-context';
import { useContext } from 'react';

export default function GlobalConfig() {
  const {
    cancelable, urgeable, seeStatusAndMsg, nodeAdminMsg, id, name, version, elements,
    triggerMode, status,
  } = useObservable<StoreValue>(store);
  const { appID } = useContext(FlowContext);
  const changedRef = useRef<{ key: keyof StoreValue, checked: boolean }>();

  const saver = useSave(appID, id);
  useEffect(() => {
    if (!changedRef.current?.key || !name || !triggerMode) {
      return;
    }
    saver({
      bpmnText: JSON.stringify({
        version,
        shapes: elements,
      }),
      name: name as string,
      triggerMode: triggerMode as string,
      canCancel: cancelable ? 1 : 0,
      canUrge: urgeable ? 1 : 0,
      canMsg: nodeAdminMsg ? 1 : 0,
      canViewStatusMsg: seeStatusAndMsg ? 1 : 0,
      appId: appID,
    },
    () => updateStore((s) => ({ ...s, saved: true })),
    () => changedRef.current?.key && updateStoreByKey(
      changedRef.current?.key,
      () => !changedRef.current?.checked,
    ));
  }, [changedRef.current]);

  const options = [{
    field: 'cancelable',
    title: '流程发起后允许撤回',
    desc: '流程发起后允许撤回',
    subTitle: '流程发起后允许撤回',
    checked: cancelable,
  }, {
    field: 'urgeable',
    title: '允许工作流发起人催办',
    desc: '允许工作流发起人催办',
    subTitle: '表单元素输入帮助提示，表单元素输入帮助提示。',
    checked: urgeable,
  }, {
    field: 'seeStatusAndMsg',
    title: '允许查看工作流状态与留言',
    desc: '允许查看工作流状态与留言',
    subTitle: '表单元素输入帮助提示，表单元素输入帮助提示。',
    checked: seeStatusAndMsg,
  }, {
    field: 'nodeAdminMsg',
    title: '允许节点负责人留言',
    desc: '允许节点负责人留言',
    subTitle: '表单元素输入帮助提示，表单元素输入帮助提示。',
    checked: nodeAdminMsg,
  }];

  function onChange(type: keyof StoreValue) {
    return (checked?: boolean) => {
      changedRef.current = { key: type, checked: !!checked };
      updateStoreByKey(type, () => !!checked);
    };
  }

  if (typeof cancelable === 'undefined') {
    return null;
  }

  return (
    <div className="w-full flex-col flex items-center">
      <div
        className="w-full h-56 items-center flex px-20 bg-gray-1000
        shadow-header text-gray-900 mb-20">
        全局配置
      </div>
      {options.map((option) => (
        <section key={option.field} className="bg-white rounded-12 flex p-20 mb-16 w-full max-w-%90">
          <div onClick={() => {
            if (status === 'ENABLE') {
              return toast.error('启用状态的流程无法编辑');
            }
          }}>
            <Toggle
              defaultChecked={option.checked}
              className="mr-16"
              onChange={onChange(option.field as keyof StoreValue)}
              disabled={status === 'ENABLE'}
            />
          </div>
          <div>
            <div className="text-body2-no-color text-gray-600 mb-4 flex items-center">
              <span className="mr-8">{option.title}</span>
              <ToolTip
                inline
                label={option.desc}
                position="top"
                labelClassName="whitespace-nowrap"
              >
                <Icon name="info" />
              </ToolTip>
            </div>
            <span className="text-caption-no-color text-gray-400">
              {option.subTitle}
            </span>
          </div>
        </section>
      ))}
    </div>
  );
}
