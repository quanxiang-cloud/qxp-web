import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { createAsyncFormActions, SchemaForm, setValidationLanguage } from '@formily/antd';

import { StoreContext } from './context';
import { observer } from 'mobx-react';
import registry from './registry';
import FormFieldWrapper from './registry/form-field-wrapper';

const actions = createAsyncFormActions();
setValidationLanguage('zh');

type CollectedProps = {
  isOver: boolean;
}

function FormFields(): JSX.Element {
  const store = useContext(StoreContext);

  const [{ isOver }, drop] = useDrop<FormBuilder.DragObject, FormBuilder.DropResult, CollectedProps>({
    accept: 'SOURCE_ELEMENT',
    drop: () => {
      return {
        id: 'todo delete this',
        item: 'something?',
        index: 0,
        dropPosition: 'upper',
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (!store.fields.length) {
    return (
      <div
        ref={drop}
        className="form-builder-canvas"
        style={{ outline: isOver ? '2px dashed var(--blue-600)' : undefined }}
      >
        <div className="form-builder-canvas__empty-tip">
          <img src="/dist/images/drag_tips.svg" alt="" />
          <div className="text">请从左侧拖拽所需字段组成表单</div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-builder-canvas">
      <SchemaForm
        actions={actions}
        components={{ ...registry.components, FormFieldWrapper }}
        schema={store.schemaForCanvas}
      />
    </div>
  );
}

export default observer(FormFields);
