import React, { ChangeEvent } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { isString, isBoolean, isNull } from 'lodash';

import { getFullPath, getObjectEditorNewField } from '@polyApi/utils/object-editor';

import InputEditor from './input-editor';
import FieldTypeSelector from './object-editor/field-type-selector';
import RequiredSelector from './object-editor/required-selector';
import ArrowDownTrigger from './arrow-down-trigger';
import ObjectEditor, { Row } from './object-editor';
import { Store, ItemStore } from './object-editor/store';

const initialValues: POLY_API.ObjectSchema[] = [{
  type: 'object',
  name: 'a',
  index: 0,
  parentPath: null,
  required: false,
  desc: 'a 是一个对象',
  in: 'body',
  children: [{
    type: 'number',
    name: 'b',
    index: 0,
    parentPath: 'a',
    required: true,
    desc: 'a.b 是一个数字',
    in: 'body',
    children: [],
  }, {
    type: 'array',
    name: 'c',
    index: 1,
    parentPath: 'a',
    required: true,
    desc: 'a.c 是一个数组',
    in: 'body',
    children: [{
      type: 'string',
      name: null,
      index: 0,
      parentPath: 'a.c',
      required: false,
      desc: 'a.c.0 是一个字符串',
      in: 'body',
      children: [],
    }],
  }],
}, {
  type: 'string',
  name: 'hello',
  index: 1,
  parentPath: null,
  required: true,
  desc: 'hello 是一个字符串',
  in: 'body',
  children: [],
}];

function BodyEditor(props: ISchemaFieldComponentProps): JSX.Element {
  props;
  // const componentProps = props.props?.['x-component-props'] as Props;
  function isObjectField(type: string): boolean {
    return ['object', 'array'].includes(type);
  }

  function handleRowChange(
    keyType: keyof POLY_API.ObjectSchema,
    current$: ItemStore<POLY_API.ObjectSchema>,
    store$: Store<POLY_API.ObjectSchema>,
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
    current$: ItemStore<POLY_API.ObjectSchema>, store$: Store<POLY_API.ObjectSchema>,
  ) {
    return () => {
      current$.isChildrenHidden ? current$.showChidren() : current$.hideChildren();
      store$.update();
    };
  }

  function nameRender(
    { name, parentPath, current$, index, type }: Row<POLY_API.ObjectSchema>,
    store$: Store<POLY_API.ObjectSchema>,
  ): JSX.Element {
    const path = getFullPath(parentPath, name, index);
    const level = path.split('.').length;
    console.log({ name, parentPath, path, index });
    return (
      <div className="flex items-center" style={{ marginLeft: (level - 1) * 20 }}>
        {(type === 'object' || type === 'array') && (
          <ArrowDownTrigger
            className="mr-5"
            isContentVisible={!current$.isChildrenHidden}
            onToggle={handleHideChildren(current$, store$)}
          />
        )}
        {!isNull(name) && (
          <InputEditor className="flex-1" value={name} onChange={handleRowChange('name', current$, store$)} />
        )}
        {isNull(name) && <span className="text-caption-no-color-weight text-gray-400">{index}</span>}
      </div>
    );
  }

  function typeRender(
    { type, current$ }: Row<POLY_API.ObjectSchema>,
    store$: Store<POLY_API.ObjectSchema>,
  ): JSX.Element {
    return (
      <FieldTypeSelector type={type} onChange={handleRowChange('type', current$, store$)} />
    );
  }

  function requiredRender(
    { required, current$ }: Row<POLY_API.ObjectSchema>,
    store$: Store<POLY_API.ObjectSchema>,
  ): JSX.Element {
    return (
      <RequiredSelector value={required} onChange={handleRowChange('required', current$, store$)} />
    );
  }

  function descRender(
    { desc, current$ }: Row<POLY_API.ObjectSchema>,
    store$: Store<POLY_API.ObjectSchema>,
  ): JSX.Element {
    return <InputEditor value={desc} onChange={handleRowChange('desc', current$, store$)} />;
  }

  function handleAddField(
    row: Row<POLY_API.ObjectSchema> | null,
    store$: Store<POLY_API.ObjectSchema>,
  ): void {
    if (!row) {
      return store$?.addChild(getObjectEditorNewField(null), store$.value.length);
    }
    const { type, current$, parent$, children$, parentPath, name, index } = row;
    const defaultNewField = getObjectEditorNewField(getFullPath(parentPath, name, index));
    if (type === 'object') {
      current$.addChild(defaultNewField, children$.length);
      return store$.update();
    }
    if (type === 'array' && children$) {
      defaultNewField.name = null;
      current$.addChild(defaultNewField, children$.length);
      return store$.update();
    }
    if (!parent$) {
      return;
    }
    if ((parent$.value as POLY_API.ObjectSchema)?.type === 'array') {
      defaultNewField.name = null;
    }
    defaultNewField.parentPath = parentPath;
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
      title: '是否必填',
      dataIndex: 'required',
      render: requiredRender,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      render: descRender,
    },
  ];

  return (
    <ObjectEditor<POLY_API.ObjectSchema>
      columns={columns}
      initialValues={initialValues}
      onAddField={handleAddField}
    />
  );
}

BodyEditor.isFieldComponent = true;

export default BodyEditor;
