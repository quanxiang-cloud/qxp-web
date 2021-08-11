import React from 'react';
import { ReactSortable, Sortable } from 'react-sortablejs';
import { observer } from 'mobx-react';
import { SchemaForm } from '@formily/antd';
import { noop } from 'lodash';
import cs from 'classnames';

import registry from '../index';
import { StoreContext } from '@c/form-builder/context';
import DeleteButton from '@c/form-builder/delete-button';
interface Props {
  schema: IteratISchema;
}

function LayoutGrid({ schema }: Props): JSX.Element {
  const { id } = schema;

  const store = React.useContext(StoreContext);

  const [fields, setFields] = React.useState<Array<IteratISchema>>([]);

  React.useEffect(() => {
    const _fields = store.fieldsForLayout[id] || [];
    setFields(_fields.filter((field) => field.display));
  }, [store.fieldsForLayout]);

  const handleAddField = (e: Sortable.SortableEvent): void => {
    let fieldName: string;
    const dataId = e.clone.getAttribute('data-id');
    const index = e.newIndex;

    if (dataId === null || index === undefined) return;

    if (dataId.startsWith('form_builder_')) {
      fieldName = dataId.split('form_builder_')[1];

      store.appendComponentToLayout(schema.id, fieldName, index);
    } else {
      fieldName = dataId;

      store.modComponentPosition(fieldName, index, schema.id);
    }
  };

  const handleUpdateField = (e: Sortable.SortableEvent): void => {
    const { newIndex, oldIndex } = e;
    const fieldName = e.clone.getAttribute('data-id');

    if (newIndex === undefined || oldIndex === undefined || fieldName === null) return;

    store.updateFieldInLayoutIndex(newIndex, oldIndex, fieldName, id);
  };

  const properties = schema?.properties?.FIELDs?.properties?.[id] as ISchema;
  const columns = properties?.['x-component-props']?.columns || 2;

  return (
    <ReactSortable
      className="min-h-32 border_b6 layout-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridColumnGap: '4px',
      }}
      group={{
        name: 'form_builder_canvas_layout',
        pull: true,
        put: (to, from, ele) => {
          const group = from.options.group as Sortable.GroupOptions;
          const canDrop = ['form_builder_basic', 'form_builder_advance', 'form_builder_canvas_layout']
            .includes(group.name);

          if (canDrop) return true;

          if (group.name === 'form_builder' && (ele.getAttribute('data-layout') !== 'layout')) {
            return true;
          }

          return false;
        },
      }}
      direction="vertical"
      animation={600}
      list={fields}
      setList={noop}
      onAdd={handleAddField}
      onUpdate={handleUpdateField}
      onStart={() => store.setDragging(true)}
      onEnd={() => store.setDragging(false)}
    >
      {fields.map((itm) => {
        const id = itm.id;

        return (
          <div
            key={id}
            className={cs(
              'field-item',
              'field-mask',
              { 'field-item-active': id === store.activeFieldName },
            )}
            onClick={(e) => {
              e.stopPropagation();
              store.setActiveFieldKey(id);
            }}
          >
            <SchemaForm components={registry.components} schema={itm} />
            <DeleteButton filedName={id} />
          </div>
        );
      })}

    </ReactSortable>
  );
}

LayoutGrid.isVirtualFieldComponent = true;

export default observer(LayoutGrid);
