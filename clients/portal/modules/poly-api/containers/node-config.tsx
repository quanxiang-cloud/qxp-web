import React from 'react';
import { isEmpty } from 'ramda';

import Select from '@c/select';
import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';

import store$ from '../store';

export default function NodeConfigDrawer(): JSX.Element {
  const store = useObservable(store$);
  const initialConfigParams = {
    currentNodeConfigParams: { schema: {}, currentNode: undefined, onClose: undefined, full: false },
  };
  const {
    currentNodeConfigParams: { schema, currentNode, onClose },
  } = isEmpty(store) ? initialConfigParams : store;

  function onCancel(): void {
    onClose?.();
    store$.set('currentNodeConfigParams', {
      schema: {},
      currentNode: undefined,
      onClose: undefined,
      full: false,
    });
  }

  return (
    <Drawer
      position="right"
      className="node-config-drawer"
      title={`配置${currentNode?.value.type}节点`}
      onCancel={onCancel}
      visible={!!(schema && currentNode)}
    >
      <div className="px-20 py-12 flex items-center justify-between border-b-1">
        <div className="flex items-center mr-16 flex-1">
          <span>全部API：</span>
          <Select className="flex-1" options={[]} />
        </div>
        <div className="flex items-center justify-between flex-2">
          <span>请求方法：</span>
          <span className="text-green-600 mr-8">POST</span>
          <span>接口路径：</span>
          <span className="mr-8 flex-1 truncate">http://www.qingcloud.com.sdasdasfasfasdasd..</span>
          <span>API标识：</span>
          <span>ap</span>
        </div>
      </div>
      <div className="flex">
        <div className="p-12 flex-2">

        </div>
        <div className="flex-1 px-12 border-l-1 border-gray-200 flex flex-col">
          <div className="flex items-center py-12">
            <span className="text-12 font-semibold">运算符：</span>
            <div className="flex-1 flex items-center justify-between">
              <span className="request-op">+</span>
              <span className="request-op">-</span>
              <span className="request-op">/</span>
              <span className="request-op">*</span>
              <span className="request-op">()</span>
            </div>
          </div>
          <div className="pt-12 border-t-1 border-gray-200 flex-1">DataTree</div>
        </div>
      </div>
    </Drawer>
  );
}
