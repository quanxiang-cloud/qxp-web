import React, { useContext } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { StoreContext } from '../context';
import Icon from '@c/icon';

function FormLabelConfig(): JSX.Element {
  const store = useContext(StoreContext);

  function handleClick(value: string):void {
    store.labelAlign = value;
  }

  function renderLayoutOption() {
    return (
      <>
        <div
          className={classnames('content-item', { 'item-checked': store.labelAlign==='left' })}
          onClick={() => handleClick('left')}
        >
          <div>
            <span className="item-label"></span>
            <span className="item-body"></span>
          </div>
          <div>
            <span className="item-label"></span>
            <span className="item-body"></span>
          </div>
          <div className="text-center">左右</div>
          <Icon name='done' type="light" className="check-icon"/>
        </div>
        <div
          className={classnames('content-item', { 'item-checked': store.labelAlign==='top' })}
          onClick={() => handleClick('top')}
        >
          <div className="item-label"></div>
          <div className="item-body" style={{ width: '96px' }}></div>
          <div className="text-center">上下</div>
          <Icon name='done' type="light" className="check-icon"/>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pt-6">
        <div className="pb-24">
          <div className="item-title">字段标题位置</div>
          <div className="layout-content">
            {renderLayoutOption()}
          </div>
        </div>
        <div className="pb-24">
          <div className="item-title">
            表单提交校验规则:
            <Icon className='ml-2' name="info" size={18} />
          </div>
          <div className='page-setting-filter'>
            <Icon className='mr-8' name='add' size={20} />
            添加表单校验规则
          </div>
        </div>
      </div>
    </>
  );
}

export default observer(FormLabelConfig);
