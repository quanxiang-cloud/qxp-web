import React, { useContext } from 'react';
import { setValidationLanguage } from '@formily/antd';
import { observer } from 'mobx-react';

import DragDrop from '../components/drag-drop';
import FieldRender from '../components/field-render';

import { StoreContext } from '../context';
import CanvasContext from '../canvas-context';

import useHasFields from './use-fields';

setValidationLanguage('zh');

function Canvas(): JSX.Element {
  const store = useContext(StoreContext);
  const hasFields = useHasFields(store?.schema);

  if (hasFields) {
    return (
      <CanvasContext.Provider value={{ isInCanvas: true }}>
        <DragDrop id='root'>
          <div className="form-builder-canvas">
            <FieldRender schema={{ ...store.schema }} />
          </div>
        </DragDrop>
      </CanvasContext.Provider >
    );
  }

  return (
    <div className="form-builder-bg">
      <DragDrop id='root'>
        <div className="empty-form-builder-canvas" />
      </DragDrop>
    </div>
  );
}

export default observer(Canvas);
