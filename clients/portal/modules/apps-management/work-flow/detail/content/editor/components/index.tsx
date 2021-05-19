import React from 'react';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';

import store, { updateStore } from '../store';
import type { StoreValue } from '../type';
import DragNode from './drag-node';

export default function ComponentsSelector() {
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
              <DragNode
                text="填写"
                type="fillIn"
                width={200}
                height={72}
                iconName="edit"
                iconClassName="bg-teal-500"
              />
              <DragNode
                text="审批"
                type="approve"
                width={200}
                height={72}
                iconName="approves"
                iconClassName="bg-indigo-500"
              />
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}
