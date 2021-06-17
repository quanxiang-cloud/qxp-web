import React from 'react';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';

import store, { updateStore } from '../store';
import type { StoreValue } from '../type';
import DragNode from './drag-node';

const nodeLists = [{
  text: '填写',
  type: 'fillIn',
  iconName: 'edit',
  iconClassName: 'bg-teal-500',
}, {
  text: '审批',
  type: 'approve',
  iconName: 'approves',
  iconClassName: 'bg-indigo-500',
}, {
  text: '分支',
  type: 'process_branch',
  iconName: 'share',
  iconClassName: 'bg-teal-500',
}, {
  text: '变更流程参数',
  type: 'process_variable_assignment',
  iconName: 'assignment',
  iconClassName: 'bg-indigo-500',
}, {
  text: '数据新增',
  type: 'table_data_create',
  iconName: 'create_new_folder',
  iconClassName: 'bg-teal-500',
}, {
  text: '数据更新',
  type: 'table_data_update',
  iconName: 'update',
  iconClassName: 'bg-indigo-500',
}, {
  text: '发送邮件',
  type: 'send_email',
  iconName: 'email',
  iconClassName: 'bg-teal-500',
}, {
  text: '站内信',
  type: 'web_message',
  iconName: 'message',
  iconClassName: 'bg-indigo-500',
}, {
  text: '抄送',
  type: 'cc',
  iconName: 'info',
  iconClassName: 'bg-teal-500',
}];

export default function ComponentsSelector(): JSX.Element {
  const { nodeIdForDrawerForm } = useObservable<StoreValue>(store);

  return (
    <>
      {nodeIdForDrawerForm === 'components' && (
        <Drawer
          title={(
            <div>
              <span className="text-h5 mr-16">选择一个组件</span>
              <span className="text-caption text-underline">💡 了解组件</span>
            </div>
          )}
          distanceTop={0}
          onCancel={() => updateStore((s) => ({ ...s, nodeIdForDrawerForm: '' }))}
          className="flow-editor-drawer"
        >
          <div>
            <div className="text-caption-no-color text-gray-400 mb-12">人工处理</div>
            <div className="grid grid-cols-2 gap-16">
              {nodeLists.map((node) => (
                <DragNode
                  {...node}
                  key={node.text}
                  width={200}
                  height={72}
                />
              ))}
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}
