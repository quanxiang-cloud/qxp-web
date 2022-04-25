import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Tree from '@c/headless-tree';
import ErrorTips from '@c/error-tips';
import Toggle from '@c/toggle';

import FieldRender from './field-node';
import store from '../store';

function InPutRange(): JSX.Element {
  const isAll = !!store.curAuth?.paramsAll;

  function OnChangeToggle(isInputAll: boolean): void {
    store.setCurAuth({ ...store.curAuth, paramsAll: isInputAll });
  }

  if (!store.inputTreeStore) {
    return (<ErrorTips desc='获取数据失败' />);
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div
        className='rounded-12 rounded-tl-4 flex items-center justify-between
        bg-blue-100 text-blue-600 py-10 px-16 my-8'
      >
        <div>
          <Icon name='info' color='blue' className='w-16 h-16 fill-current' size={18} />
          <span className='ml-10 text-12'>
            用户可访问的字段范围。
          </span>
        </div>
        <div className='flex items-center'>
          允许字段:
          <Toggle
            onText='全部'
            offText='自定义'
            className='ml-8'
            defaultChecked={!!store.curAuth?.paramsAll}
            onChange={OnChangeToggle}
          />
        </div>
      </div>
      <div className='flex px-16 py-8 fields-item'>
        <div className='w-142'>可访问</div>
        <div className='flex-1 overflow-auto grid gap-x-16 grid-flow-row-dense grid-cols-4'>
          <div>字段</div>
          <div>标识</div>
          <div>字段类型</div>
          <div>in</div>
        </div>
      </div>
      <Tree
        store={store.inputTreeStore}
        NodeRender={({ node, store }) =>
          <FieldRender store={store} node={node} isAll={isAll} type={'input'} />
        }
        className='fields-tree overflow-auto flex-1'
        itemClassName='px-16 py-8 hover:bg-white hover:text-gray-900 text-gray-900'
      />
    </div>
  );
}

export default observer(InPutRange);
