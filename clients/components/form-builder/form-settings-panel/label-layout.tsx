import React from 'react';

import Icon from '@clients/components/icon';

export default function FormLabelConfig(): JSX.Element {
  return (
    <>
      <div className="pt-8">
        <div className="md">
          <h4 className="item-label">字段标题位置</h4>
          <div className="layout-content">
            <div className="content-item">
              <div>
                <span className="form-label"></span>
                <span className="form-item-body"></span>
              </div>
              <div>
                <span className="form-label"></span>
                <span className="form-item-body"></span>
              </div>
              <div className="text-center">左右</div>
            </div>
            <div className="content-item">
              <div>
                <span className="form-label"></span>
              </div>
              <div>
                <span className="form-item-body" style={{ width: '96px' }}></span>
              </div>
              <div className="text-center">上下</div>
            </div>
          </div>
        </div>
        <div className="md">
          <h4 className="item-label">
            <span>表单提交校验规则:</span>
            <Icon name="info" />
          </h4>
          <div className="layout-content">
            <div className="add-panel">
              <Icon name="add" />
              <span>添加表单校验规则</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
