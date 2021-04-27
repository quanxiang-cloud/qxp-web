import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { createAsyncFormActions, SchemaForm } from '@formily/antd';

import Icon from '@c/icon';

import { StoreContext } from './context';
import { observer } from 'mobx-react';
import registry from './registry';
import FormFieldWrapper from './registry/form-field-wrapper';

const actions = createAsyncFormActions();

function FormFields(): JSX.Element {
  const store = useContext(StoreContext);

  const [_, drop] = useDrop<DragObject, DropResult, any>({
    accept: 'SOURCE_ELEMENT',
    drop: () => {
      return {
        id: 'todo delete this',
        item: 'something?',
        index: 0,
        // todo refactor this
        dropPosition: 'up',
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (!store.fields.length) {
    return (
      <div ref={drop} className="form-builder-canvas">
        <div className="form-builder-canvas__empty-tip">
          <Icon name="add" size={32} />
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
