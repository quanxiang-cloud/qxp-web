import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import Tree from '@c/headless-tree';
import Toggle from '@c/toggle';

import FieldRender from './field-node';
import { observer } from 'mobx-react';
import store from '../store';

function OutPutRange(): JSX.Element {
  const isAll = !!store.curAuth?.responseAll;

  function OnChangeToggle(isOutputAll: boolean): void {
    const _curAuth = { ...store.curAuth, responseAll: isOutputAll };
    store.setCurAuth(_curAuth);
  }

  if (!store.outputTreeStore) {
    return <div>no outputTreeStore</div>;
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div
        className='rounded-12 rounded-tl-4 flex items-center justify-between
        bg-blue-100 text-blue-600 py-10 px-16'
      >
        <div>
          <Icon name='info' color='blue' className='w-16 h-16 fill-current' size={18} />
          <span className='ml-10 text-12'>
            用户在访问时只能看到在这里定义允许接收的所有参数。如果传递多余的参数，系统会自动过滤。
          </span>
        </div>
        <div className='flex items-center'>
          允许字段:
          <Toggle
            onText='全部'
            offText='自定义'
            className='ml-8'
            defaultChecked={!!store.curAuth?.responseAll}
            onChange={OnChangeToggle}
          />
        </div>
      </div>
      <div className={cs(
        'grid gap-x-16 grid-flow-row-dense px-16 py-8 pr-0 fields-item',
        isAll ? ' grid-cols-3' : ' grid-cols-4',
      )}>
        {!isAll && <span>可访问</span>}
        <span>字段</span>
        <span>标识</span>
        <span>字段类型</span>
      </div>
      <Tree
        store={store.outputTreeStore}
        NodeRender={({ node, store }) =>
          <FieldRender store={store} node={node} isAll={isAll}/>}
        className='fields-tree overflow-auto flex-1'
        itemClassName='hover:bg-white hover:text-gray-900 text-gray-900'
      />
    </div>
  );
}

export default observer(OutPutRange);
