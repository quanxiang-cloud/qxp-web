import React from 'react';
import cs from 'classnames';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { StoreContext } from './context';
import Store from './store';
import Canvas from './canvas-panel';
import SourceElementPanel from './source-element-panel';
import FormSettingPanel from './form-settings-panel';

type Props = {
  className?: string;
  store: Store;
}

const CanvasWrapper = (): JSX.Element => (<div className="canvas-wrapper"><Canvas /></div>);

function FormBuilder({ className, store }: Props): JSX.Element {
  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <ConfigProvider locale={zhCN}>
        <StoreContext.Provider value={store}>
          <div className={cs('form-builder', className)}>
            <SourceElementPanel />
            <CanvasWrapper />
            <FormSettingPanel />
          </div>
        </StoreContext.Provider>
      </ConfigProvider>
    </DndProvider>
  );
}

export default FormBuilder;
