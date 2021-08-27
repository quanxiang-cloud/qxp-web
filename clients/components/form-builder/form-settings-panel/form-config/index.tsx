import React, { useContext } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';

import { StoreContext } from '../../context';
import ValidationRules from './validation-rules';
import VsibleHiddenRules from './visible-hidden-rules';

type RenderLayoutOptionProps = {
  labelAlign: 'right' | 'top';
  onChange: (labelAlign: 'right' | 'top') => void;
}
function RenderLayoutOption({ labelAlign, onChange }: RenderLayoutOptionProps): JSX.Element {
  return (
    <>
      <div
        className={cs('content-item', { 'item-checked': labelAlign === 'right' })}
        onClick={() => onChange('right')}
      >
        <div className="item-container">
          <span className="item-label"></span>
          <span className="item-body"></span>
        </div>
        <div className="item-container mt-8">
          <span className="item-label"></span>
          <span className="item-body"></span>
        </div>
        <div className="text-center">左右</div>
        <Icon name='done' type="light" className="check-icon" />
      </div>
      <div
        className={cs('content-item', { 'item-checked': labelAlign === 'top' })}
        onClick={() => onChange('top')}
      >
        <div className="grid grid-cols-1">
          <span className="item-label"></span>
          <span className="item-body mt-8" style={{ width: '96px' }}></span>
        </div>
        <div className="text-center">上下</div>
        <Icon name='done' type="light" className="check-icon" />
      </div>
    </>
  );
}

function FormConfig(): JSX.Element {
  const store = useContext(StoreContext);

  function handleClick(value: 'right' | 'top'): void {
    store.updateLabelAlign(value);
  }

  return (
    <>
      {/* <ColumnNumberOption /> */}
      <div className="pt-6">
        <div className="pb-24">
          <div className="item-title">字段标题位置</div>
          <div className="layout-content">
            <RenderLayoutOption labelAlign={store.labelAlign} onChange={handleClick} />
          </div>
        </div>
        <VsibleHiddenRules />
        <div className="pb-24">
          <div className="item-title">表单提交验证规则</div>
          <ValidationRules />
        </div>
      </div>
    </>
  );
}

export default observer(FormConfig);
