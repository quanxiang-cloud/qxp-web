import React from 'react';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import useObservable from '@lib/hooks/use-observable';

import store, { StoreValue, updateStore } from '../editor/store';

export default function GlobalConfig() {
  const {
    cancelable, urgeable, seeStatusAndMsg, nodeAdminMsg,
  } = useObservable<StoreValue>(store) || {};

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

  function onChange(type: string) {
    return (checked?: boolean) => {
      updateStore(type, () => !!checked);
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
        <section key={option.field} className="bg-white rounded-12 flex p-20 mb-16 w-800 max-w-%90">
          <Toggle
            defaultChecked={option.checked}
            className="mr-16"
            onChange={onChange(option.field)}
          />
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
