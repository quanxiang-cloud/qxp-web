import React, { useContext } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { StoreContext } from '../context';
import Icon from '@clients/components/icon';

function FormLabelConfig(): JSX.Element {
  const store = useContext(StoreContext);

  function handleClick(value: string):void {
    store.labelAlign = value;
  }

  function renderLayoutOption() {
    return (
      <>
        <div
          className={classnames('content-item', { 'item-focus': store.labelAlign==='left' })}
          onClick={() => {
            handleClick('left');
          }}
        >
          <div>
            <span className="form-label"></span>
            <span className="form-item-body"></span>
          </div>
          <div>
            <span className="form-label"></span>
            <span className="form-item-body"></span>
          </div>
          <div className="text-center">左右</div>
          <div className="rectangle"></div>
          <Icon name='done' type="light" className="ok-icon"/>
        </div>
        <div
          className={classnames('content-item', { 'item-focus': store.labelAlign==='top' })}
          onClick={() => {
            handleClick('top');
          }}
        >
          <div>
            <span className="form-label"></span>
          </div>
          <div>
            <span className="form-item-body" style={{ width: '96px' }}></span>
          </div>
          <div className="text-center">上下</div>
          <div className="rectangle"></div>
          <Icon name='done' type="light" className="ok-icon"/>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pt-8">
        <div className="md">
          <h4 className="item-label">字段标题位置</h4>
          <div className="layout-content">
            {renderLayoutOption()}
          </div>
        </div>
        <div className="md">
          <h4 className="item-label">
            <span>表单提交校验规则:</span>
            <Icon name="info" />
          </h4>
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
