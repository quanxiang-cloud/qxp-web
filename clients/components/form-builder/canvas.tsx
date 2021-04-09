import React, { useContext } from 'react';
import Icon from '@c/icon';
import DropWrapper from './drop-wrapper';
import { EmptyPlaceholder } from './StyledComponents';
import { StoreContext } from './context';
import { observer } from 'mobx-react';
import { createAsyncFormActions, SchemaForm } from '@formily/antd';

import registry from './registry';
import FormFieldWrapper from './registry/form-field-wrapper';

type Props = {
}

const actions = createAsyncFormActions();

function FormFields({ }: Props): JSX.Element {
  const store = useContext(StoreContext);

  const containerItem = {
    id: '$0',
    name: 'CanvasContainer',
  };

  if (!store.fields.length) {
    return (
      <DropWrapper
        className="canvas-container"
        id="$0"
        isWrapper
        path="$0"
        index={0}
        item={containerItem}
        draggable={false}
      >
        <EmptyPlaceholder>
          <Icon name="add" size={32} />
          <div className="text">请从左侧拖拽所需字段组成表单</div>
        </EmptyPlaceholder>
      </DropWrapper>
    );
  }

  return (
    <SchemaForm
      actions={actions}
      components={{ ...registry.components, FormFieldWrapper }}
      schema={store.schemaForCanvas}
    />
  );
}

export default observer(FormFields);
