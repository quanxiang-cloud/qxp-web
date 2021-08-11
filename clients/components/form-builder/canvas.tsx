import React, { useContext } from 'react';
import { createAsyncFormActions, SchemaForm, setValidationLanguage } from '@formily/antd';
import { ReactSortable, Sortable } from 'react-sortablejs';
import { noop } from 'lodash';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { StoreContext } from './context';
import registry from './registry';
import DeleteButton from '@c/form-builder/delete-button';

const actions = createAsyncFormActions();
setValidationLanguage('zh');

const GroupOptions: Sortable.GroupOptions = {
  name: 'form_builder',
  pull: true,
  put: ['form_builder_basic', 'form_builder_advance', 'form_builder_layout', 'form_builder_canvas_layout'],
};

function FormFields(): JSX.Element {
  const store = useContext(StoreContext);
  const [fields, setFields] = React.useState<IteratISchema[]>([]);
  const [hiddenFields, setHiddenFields] = React.useState<IteratISchema[]>([]);

  const handleAddField = (e: Sortable.SortableEvent): void => {
    let fieldName: string;

    const dataId = e.clone.getAttribute('data-id');
    const index = e.newIndex;

    if (dataId === null || index === undefined) return;

    if (dataId.startsWith('form_builder_')) {
      fieldName = dataId.split('form_builder_')[1];

      store.appendComponent(fieldName, index);
    } else {
      fieldName = dataId;

      store.modComponentPosition(fieldName, index);
    }
  };

  const handleUpdateField = (e: Sortable.SortableEvent): void => {
    const { newIndex, oldIndex } = e;
    const fieldName = e.clone.getAttribute('data-id');

    if (newIndex === undefined || oldIndex === undefined || fieldName === null) return;

    store.updateFieldIndex(newIndex, oldIndex, fieldName);
  };

  React.useEffect(() => {
    setFields(store.fieldsForCanvas.filter((itm) => !!itm.display));
  }, [store.fieldsForCanvas]);

  React.useEffect(() => {
    setHiddenFields(store.hiddenFieldsForCanvas);
  }, [store.hiddenFieldsForCanvas]);

  if (!fields.length) {
    return (
      <div className="form-builder-bg">
        <ReactSortable
          group={GroupOptions}
          animation={400}
          list={fields}
          setList={noop}
          onAdd={handleAddField}
          className="empty-form-builder-canvas"
        />
      </div>
    );
  }

  return (
    <div className="form-builder-canvas">
      <ReactSortable
        group={GroupOptions}
        animation={600}
        list={fields}
        setList={noop}
        onUpdate={handleUpdateField}
        onAdd={handleAddField}
        onStart={() => store.setDragging(true)}
        onEnd={() => store.setDragging(false)}
      >
        {fields.map((schema: IteratISchema) => {
          const { isLayoutComponent } = schema['x-internal'] || {};

          const componentName = schema.properties?.FIELDs?.properties?.[schema.id]?.['x-component'];

          if (componentName === undefined) return null;

          const Component = registry.layoutComponents[componentName.toLocaleLowerCase()];

          return (
            <div
              onClick={() => store.setActiveFieldKey(schema.id)}
              key={schema.id}
              data-layout={isLayoutComponent ? 'layout' : 'simple'}
              className={cs('field-item', {
                'field-mask': !isLayoutComponent,
                'field-item-active': store.activeFieldName === schema.id,
              })}
            >
              {
                isLayoutComponent ?
                  React.createElement(Component, { schema }) :
                  <SchemaForm schema={schema} actions={actions} components={{ ...registry.components }} />
              }
              <DeleteButton filedName={schema.id} />
            </div>
          );
        })}
      </ReactSortable>
      <div className={cs('form-build-hidden-fields', { hidden: !hiddenFields.length })}>
        {hiddenFields.map((schema: IteratISchema) => {
          return (
            <div
              onClick={() => store.setActiveFieldKey(schema.id)}
              key={schema.id}
              className={cs(
                'field-item field-mask',
                { 'field-item-active': store.activeFieldName === schema.id },
              )}
            >
              <SchemaForm schema={schema} actions={actions} components={{ ...registry.components }} />
              <DeleteButton filedName={schema.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default observer(FormFields);
