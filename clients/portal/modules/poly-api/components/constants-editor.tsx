import React, { ChangeEvent } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { isString, isBoolean } from 'lodash';

import { getObjectEditorNewConstantField } from '@polyApi/utils/object-editor';

import InputEditor from './input-editor';
import FieldTypeSelector from './object-editor/field-type-selector';
import ObjectEditor, { Row } from './object-editor';
import { Store, ItemStore } from './object-editor/store';

const initialValues: POLY_API.PolyConstSchema[] = [{
  type: 'string',
  name: '',
  desc: '',
  data: '',
  in: 'hide',
  children: [],
  index: 0,
}, {
  type: 'string',
  name: '',
  desc: '',
  data: '',
  in: 'hide',
  children: [],
  index: 1,
}];

function BodyEditor(props: ISchemaFieldComponentProps): JSX.Element {
  props;
  // const componentProps = props.props?.['x-component-props'] as Props;
  function isObjectField(type: string): boolean {
    return ['object', 'array'].includes(type);
  }

  function handleRowChange(
    keyType: keyof POLY_API.PolyConstSchema,
    current$: ItemStore<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ) {
    return (e: ChangeEvent<HTMLInputElement> | string | boolean) => {
      const value = isString(e) || isBoolean(e) ? e : e.target.value;
      if (keyType === 'type' && isObjectField(current$.get('type')) && !isObjectField(`${value}`)) {
        current$.removeChild();
      }
      current$.set(keyType, value);
      store$.update();
    };
  }

  function handleHideChildren(
    current$: ItemStore<POLY_API.PolyConstSchema>, store$: Store<POLY_API.PolyConstSchema>,
  ) {
    return () => {
      current$.isChildrenHidden ? current$.showChidren() : current$.hideChildren();
      store$.update();
    };
  }

  function nameRender(
    { name, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return (
      <div className="flex items-center">
        <InputEditor className="flex-1" value={name} onChange={handleRowChange('name', current$, store$)} />
      </div>
    );
  }

  function typeRender(
    { type, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return (
      <FieldTypeSelector type={type} simple onChange={handleRowChange('type', current$, store$)} />
    );
  }

  function valueRender(
    { data, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return (
      <>
        {data}
      </>
    );
  }

  function descRender(
    { desc, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return <InputEditor value={desc} onChange={handleRowChange('desc', current$, store$)} />;
  }

  function handleAddField(
    row: Row<POLY_API.PolyConstSchema> | null,
    store$: Store<POLY_API.PolyConstSchema>,
  ): void {
    if (!row) {
      return store$?.addChild(getObjectEditorNewConstantField(), store$.value.length);
    }
    const { type, current$, parent$, children$, name, index } = row;
    const defaultNewField = getObjectEditorNewConstantField();
    if (!parent$) {
      return;
    }
    parent$.addChild(defaultNewField, index + 1);
    return store$.update();
  }

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      render: nameRender,
    },
    {
      title: '参数类型',
      dataIndex: 'type',
      render: typeRender,
    },
    {
      title: '数值',
      dataIndex: 'data',
      render: valueRender,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      render: descRender,
    },
  ];

  return (
    <ObjectEditor<POLY_API.PolyConstSchema>
      columns={columns}
      initialValues={initialValues}
      onAddField={handleAddField}
    />
  );
}

BodyEditor.isFieldComponent = true;

export default BodyEditor;
