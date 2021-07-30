import React from 'react';
import classnames from 'classnames';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import { StoreContext } from './context';
import Store from './store';
import Canvas from './canvas';
import SourceElementPanel from './source-element-panel';
import FormSettingPanel from './form-settings-panel';

type Props = {
  className?: string;
  store: Store;
}

function FormBuilder({ className, store }: Props): JSX.Element {
  return (
    <ConfigProvider locale={zhCN}>
      <StoreContext.Provider value={store}>
        <div className={classnames('form-builder', className)}>
          <SourceElementPanel />
          <div className="canvas-wrapper">
            <Canvas />
          </div>
          <FormSettingPanel />
        </div>
      </StoreContext.Provider>
    </ConfigProvider>
  );
}

export default FormBuilder;
