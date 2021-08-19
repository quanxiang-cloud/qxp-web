import React from 'react';
import { Tabs } from 'antd';
import { SchemaForm } from '@formily/antd';
import { observer } from 'mobx-react';
import { ReactSortable, Sortable } from 'react-sortablejs';
import cs from 'classnames';
import { noop } from 'lodash';

import registry from '../index';
import { StoreContext } from '@c/form-builder/context';
import DeleteButton from '@c/form-builder/delete-button';
import { findField } from '@c/form-builder/utils/fields-operator';

const { TabPane } = Tabs;

interface Props {
  schema: IteratISchema;
}

function LayoutTabs({ schema }: Props): JSX.Element | null {
  const { id } = schema;
  const store = React.useContext(StoreContext);

  const [fields, setFields] = React.useState<Array<IteratISchema & { tabIndex?: string }>>([]);
  React.useEffect(() => {
    setFields(store.getFieldsInLayout(id));
  }, [store.fields]);

  const properties: ISchema | undefined = schema?.properties?.FIELDs?.properties?.[id];

  if (properties === undefined) return null;

  const tabs: string[] = properties?.['x-component-props']?.tabs;
  const position = properties?.['x-component-props']?.position;
  const [activeKey, setActiveKey] = React.useState(tabs[0]);

  const handleAddField = (e: Sortable.SortableEvent): void => {
    let fieldName: string;
    const dataId = e.clone.getAttribute('data-id');
    const index = e.newIndex;

    if (dataId === null || index === undefined) return;

    if (dataId.startsWith('form_builder_')) {
      fieldName = dataId.split('form_builder_')[1];

      store.appendComponent(fieldName, index, id, activeKey);
    } else {
      fieldName = dataId;

      store.updateFieldIndex(fieldName, index, schema.id, activeKey);
    }
  };

  const handleUpdateField = (e: Sortable.SortableEvent): void => {
    const { newIndex, oldIndex } = e;
    const fieldName = e.clone.getAttribute('data-id');

    if (newIndex === undefined || oldIndex === undefined || fieldName === null) return;

    store.updateFieldIndex(fieldName, newIndex, id);
  };
  return (
    <Tabs activeKey={activeKey} tabPosition={position} onChange={setActiveKey}>
      {Array.from(new Set(tabs.filter((itm) => !!itm))).map((label) => (
        <TabPane tab={label} key={label}>
          <ReactSortable
            className="min-h-32 border-b6 layout-grid"
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
            animation={600}
            list={fields}
            setList={noop}
            onAdd={handleAddField}
            onUpdate={handleUpdateField}
            onStart={() => store.setDragging(true)}
            onEnd={() => store.setDragging(false)}
          >
            {fields
              .filter((itm) => {
                const schema: ISchema = itm?.properties?.FIELDs?.properties?.[itm.id] || {};
                return schema?.['x-internal']?.tabIndex === label;
              })
              .map((itm) => {
                const id = itm.id;

                const isAssociatedRecords = findField(id, store.fields)?.componentName === 'AssociatedRecords';
                const components = isAssociatedRecords ? {
                  AssociatedRecords: registry.editComponents['associatedrecords'.toLocaleLowerCase()],
                } : registry.components;

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
                    <SchemaForm components={components} schema={itm} />
                    <DeleteButton filedName={id} />
                  </div>
                );
              })}
          </ReactSortable>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default observer(LayoutTabs);
