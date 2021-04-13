import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { StoreContext } from './context';
import Store from './store';
import Canvas from './canvas';
import SourceElementPanel from './source-element-panel';
import FormSettingPanel from './form-settings-panel';

type Props = {
  className?: string;
  store: Store;
}

function FormBuilder({ className, store }: Props) {
  return (
    <StoreContext.Provider value={store}>
      <div className={`form-builder ${className}`}>
        <DndProvider backend={HTML5Backend} context={window}>
          <SourceElementPanel />
          <div className="canvas-wrapper">
            <Canvas />
          </div>
        </DndProvider>
        <FormSettingPanel />
      </div>
    </StoreContext.Provider>
  );
}

export default FormBuilder;
