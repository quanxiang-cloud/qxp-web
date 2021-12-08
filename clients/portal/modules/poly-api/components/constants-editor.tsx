import React, { ChangeEvent, useCallback, useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { isString, isBoolean, isNumber } from 'lodash';
import { equals } from 'ramda';

import {
  getObjectEditorNewConstantField, fromApiDataToPolyConstSchema, fromPolyConstSchemaToApiData, isObjectField,
} from '@polyApi/utils/object-editor';

import InputEditor from './input-editor';
import FieldTypeSelector from './object-editor/field-type-selector';
import ObjectEditor, { Row } from './object-editor';
import { Store, ItemStore } from './object-editor/store';
import BooleanSelector from './object-editor/boolean-selector';

function BodyEditor({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const handleChange = useCallback((_value: POLY_API.PolyConstSchema[]) => {
    const distValue = fromPolyConstSchemaToApiData(_value);
    !equals(value, distValue) && mutators.change(distValue);
  }, [value]);
  const errorsRef = useRef<Record<string, string>>({});

  function handleRowChange(
    rowId: string,
    keyType: keyof POLY_API.PolyConstSchema,
    current$: ItemStore<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ) {
    return (e: ChangeEvent<HTMLInputElement> | string | number | boolean) => {
      const value = isString(e) || isBoolean(e) || isNumber(e) ? e : e.target.value;
      errorsRef.current[rowId] = !value ? '参数名称必填' : '';
      if (keyType === 'type' && isObjectField(current$.get('type')) && !isObjectField(`${value}`)) {
        current$.removeChild();
      }
      current$.set(keyType, value);
      store$.update();
    };
  }

  function nameRender(
    { id, name, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return (
      <div className="flex items-center">
        <InputEditor
          className="flex-1"
          value={name}
          onChange={handleRowChange(id, 'name', current$, store$)}
          placeholder="请输入字段名称"
        />
        {!!errorsRef.current[id] && (
          <span className="text-red-600 px-3 pb-3 text-12">参数名称必填</span>
        )}
      </div>
    );
  }

  function typeRender(
    { id, type, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return (
      <FieldTypeSelector
        simple
        type={type}
        onChange={handleRowChange(id, 'type', current$, store$)}
      />
    );
  }

  function valueRender(
    { id, data, type, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    if (type === 'boolean' || isBoolean(data)) {
      return (
        <BooleanSelector value={!!data} onChange={handleRowChange(id, 'data', current$, store$)} />
      );
    }

    return (
      <InputEditor
        className="ml-2"
        type={type === 'number' ? 'number' : 'text'}
        value={data}
        onChange={handleRowChange(id, 'data', current$, store$)}
        placeholder="请输入字段值"
      />
    );
  }

  function descRender(
    { id, desc, current$ }: Row<POLY_API.PolyConstSchema>,
    store$: Store<POLY_API.PolyConstSchema>,
  ): JSX.Element {
    return (
      <InputEditor
        value={desc}
        onChange={handleRowChange(id, 'desc', current$, store$)}
        placeholder="请输入字段描述"
      />
    );
  }

  function handleAddField(
    row: Row<POLY_API.PolyConstSchema> | null,
    store$: Store<POLY_API.PolyConstSchema>,
  ): void {
    if (!row || !row?.parent$) {
      return store$?.addChild(getObjectEditorNewConstantField(), store$.Value.length);
    }
    const { parent$, index, type } = row;
    const defaultNewField = getObjectEditorNewConstantField();
    if (type === 'boolean') {
      defaultNewField.data = false;
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
    <>
      <p className="mt-8 mb-4 text-h6-no-color-weight text-gray-900">常量参数</p>
      <ObjectEditor<POLY_API.PolyConstSchema>
        columns={columns}
        value={fromApiDataToPolyConstSchema((value || []) as POLY_API.PolyConstSchema[])}
        onAddField={handleAddField}
        onChange={handleChange}
      />
    </>
  );
}

BodyEditor.isFieldComponent = true;

export default BodyEditor;
