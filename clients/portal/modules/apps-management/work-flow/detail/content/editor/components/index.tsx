import React from 'react';

import useObservable from '@lib/hooks/use-observable';

import store, { toggleNodeForm } from '../store';
import type { StoreValue } from '../type';
import Drawer from '../forms/drawer';
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
  type: 'processBranch',
  iconName: 'share',
  iconClassName: 'bg-teal-500',
}, {
  text: '变更流程参数',
  type: 'processVariableAssignment',
  iconName: 'assignment',
  iconClassName: 'bg-indigo-500',
}, {
  text: '数据新增',
  type: 'tableDataCreate',
  iconName: 'create_new_folder',
  iconClassName: 'bg-teal-500',
}, {
  text: '数据更新',
  type: 'tableDataUpdate',
  iconName: 'update',
  iconClassName: 'bg-indigo-500',
}, {
  text: '发送邮件',
  type: 'email',
  iconName: 'email',
  iconClassName: 'bg-teal-500',
}, {
  text: '站内信',
  type: 'letter',
  iconName: 'message',
  iconClassName: 'bg-indigo-500',
}, {
  text: '抄送',
  type: 'autocc',
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
          onCancel={() => toggleNodeForm('')}
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
