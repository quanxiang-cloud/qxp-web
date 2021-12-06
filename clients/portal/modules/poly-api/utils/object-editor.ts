import { isNull, flattenDeep, isArray, isString } from 'lodash';
import { nanoid } from 'nanoid';

import type { ItemStore } from '../components/object-editor/store';
import type { Row } from '../components/object-editor';

export function getFullPath(parentPath: string | null, name: string | null, index: number): string {
  const currentName = isNull(name) ? `${index}` : name;
  return isNull(parentPath) ? currentName : `${parentPath}.${currentName}`;
}

function objectSchemaToNodeInput(
  schema: POLY_API.ObjectSchema, data: POLY_API.PolyNodeInput[],
): POLY_API.PolyNodeInput {
  const { type, name, required, desc, rule, in: _in, id } = schema;
  return {
    type: rule ? 'direct_expr' : type,
    name: name || '',
    desc,
    data: rule || (!isObjectField(type) && isArray(data) ? '' : data),
    in: _in,
    required,
    id,
  };
}

export function fromObjectSchemaToApiData(
  _objectSchema: POLY_API.ObjectSchema[], isFirstLevel = true,
): POLY_API.PolyNodeInput[] {
  let objectSchema = _objectSchema;
  objectSchema = isFirstLevel ?
    objectSchema.filter((schema) => schema.parentPath === null) :
    objectSchema;
  return objectSchema.map(
    (schema) => objectSchemaToNodeInput(schema, fromObjectSchemaToApiData(schema.children, false)),
  );
}

export function fromApiDataToObjectSchema(
  data: POLY_API.PolyNodeInput[], _parentPath: string | null = null,
): POLY_API.ObjectSchema[] {
  return data.map(({ type, name, desc, data: childrenData, required, in: _in, id = nanoid() }, index: number) => {
    const parentPath = _parentPath ? getFullPath(_parentPath, name, index) : name;
    const children = isArray(childrenData) ? fromApiDataToObjectSchema(childrenData, parentPath) : [];
    return {
      type,
      name,
      desc: desc || '',
      children,
      required: !!required,
      in: _in,
      index,
      rule: type === 'direct_expr' && isString(childrenData) ? childrenData : undefined,
      parentPath: _parentPath,
      id,
    };
  });
}

export function fromApiDataToPolyConstSchema(data: POLY_API.PolyConst[]): POLY_API.PolyConstSchema[] {
  return data.map(({ type, name, desc, data, in: _in, id = nanoid() }, index) => ({
    type,
    name,
    desc,
    data,
    in: _in,
    index,
    children: [],
    id,
  }));
}

export function fromPolyConstSchemaToApiData(data: POLY_API.PolyConstSchema[]): POLY_API.PolyConst[] {
  return data.map(({ type, name, desc, data, in: _in, id }) => ({
    type,
    name,
    desc,
    data,
    in: _in,
    id,
  }));
}

export function storeValuesToDataSource<T extends { children: T[]; id: string }>(
  storeValues$: ItemStore<T>[], idSets = new Set<string>(),
): Row<T>[] {
  return flattenDeep(storeValues$.map((current$) => {
    const { Value, children$, parent$ } = current$;
    const item = { ...Value, children$, parent$, current$ };
    if (idSets.has(item.id)) {
      return [];
    }
    idSets.add(item.id);
    if (children$.length) {
      return [item, storeValuesToDataSource(children$, idSets)];
    }
    return item;
  }));
}

export function getObjectEditorNewField(
  parentPath: string | null, _in: 'body' | 'header' | 'query' | 'path' = 'body', type = 'string',
): POLY_API.ObjectSchema {
  return {
    type: type as POLY_API.API_FIELD_TYPE,
    in: _in,
    name: '',
    index: 0,
    parentPath,
    required: false,
    desc: '',
    children: [],
    id: nanoid(),
  };
}

export function getObjectEditorNewConstantField(): POLY_API.PolyConstSchema {
  return {
    type: 'string',
    name: '',
    in: 'hide',
    desc: '',
    data: '',
    index: 0,
    children: [],
    id: nanoid(),
  };
}

export function insertToArray<T>(array: T[], index: number, value: T): T[] {
  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index),
  ];
}

export function isObjectField(type: string): boolean {
  return ['object', 'array'].includes(type);
}
