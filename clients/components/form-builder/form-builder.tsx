import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { StoreContext } from './context';
import Store from './store';
import Canvas from './canvas';
import SourceElementPanel from './source-element-panel';
import FormSettingPanel from './form-settings-panel';
import {
  FormBuilderDiv,
  PanelTitle,
  MainPanel,
} from './StyledComponents';

type Props = {
  className?: string;
  store: Store;
}

function FormBuilder({ className, store }: Props) {
  return (
    <StoreContext.Provider value={store}>
      <FormBuilderDiv className={`form-builder ${className}`}>
        <DndProvider backend={HTML5Backend} context={window}>
          <SourceElementPanel />
          <MainPanel>
            <PanelTitle>表单编辑视图</PanelTitle>
            <Canvas />
          </MainPanel>
        </DndProvider>
        <FormSettingPanel />
      </FormBuilderDiv>
    </StoreContext.Provider>
  );
}

export default FormBuilder;
